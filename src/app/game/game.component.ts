import {Component, OnInit} from '@angular/core';
import {TaskService} from "../tasks/task.service";
import {GraphTask} from "../tasks/graph-task.model";
import {parse, HtmlGenerator} from 'latex.js';
import {createHTMLWindow} from 'svgdom';
import {TaskDescriptionsAndSubjects} from "../tasks/task-descriptions-and-subjects";
import {TaskGraph} from "../tasks/task-graph";
import {GameCanvas} from "./game.canvas";
import {AuthService} from "../users/auth.service";
import {exhaustMap, Observable, take} from "rxjs";
import {UserStats} from "../users/user-stats.model";
import {environment} from "../../environments/environment";
import {User} from "../users/user.auth.model";

@Component({
	selector: 'app-game',
	templateUrl: './game.component.html',
	styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

	debugModeOn: boolean;
	debugString: string;

	gotResponseToAnswer: boolean;
	answerIsCorrect: boolean;

	currentTaskSubject: string;
	currentTaskDescription: string; //todo: config file containing the descriptions

	//testUserId = 1;
	userId = -1;

	task: GraphTask;
	graph: TaskGraph;
	gameCanvas: GameCanvas;

	constructor(
		private taskService: TaskService,
		private authService: AuthService
	) {
		this.debugString = "";
		this.debugModeOn = false;
		this.gotResponseToAnswer = false;
		this.answerIsCorrect = false;
		this.currentTaskSubject = "sample text";
		this.currentTaskDescription = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";
	}

	ngOnInit(): void {
		this.fetchUser().subscribe(user => {
			this.userId = user.id;
			this.tryToFetchTask();
		});
	}

	fetchUser(): Observable<User> {
		return this.authService.user.pipe(take(1));
	}

	tryToFetchTask() {
		this.taskService.getUserTask(this.userId).subscribe(response => {
			if(response.type == "UNDEFINED") {
				this.createAndFetchTask();
			} else {
				this.task = response;
				this.extractGraphTask(this.task);
			}
		});
	}

	createAndFetchTask() {
		this.taskService.createTask(this.userId).subscribe(response => {
			this.taskService.getUserTask(this.userId).subscribe(response => {
				this.task = response;
				this.extractGraphTask(this.task);
			});
		});
	}

	onSubmit() {
		if(this.debugModeOn) {
			//debug input in the form of textarea instead of canvas
			if(this.task.type == "DRAW") {
				this.taskService.postTaskAnswerDraw(this.debugString, this.task.taskUuid).subscribe(response => {
					this.onAnswerResponse(response);
				});
			} else if(this.task.type == "VERTEX_SELECTION") {
				this.taskService.postTaskAnswerVertexSelection(this.debugString, this.task.taskUuid).subscribe(response => {
					this.onAnswerResponse(response);
				});
			}
		} else {
			if(this.task.type == "DRAW") {
				let matrix = this.gameCanvas.getNeighbouringMatrix();
				let m = 0;
				for(let a of matrix) {
					for(let b of a) {
						if(b != 0) {
							m++;
						}
					}
				}
				m /= 2;
				let json = {
					m: m,
					matrix: matrix,
					n: matrix.length
				};
				this.sendAnswer(JSON.stringify(json));
			} else if(this.task.type == "VERTEX_SELECTION") {
				let json = {
					selectedVertices: this.gameCanvas.vertexSelectionStack
				};
				this.sendAnswer(JSON.stringify(json));
			} else if(this.task.type == "EDGE_SELECTION") {
				console.error("game.component::onSubmit does not have",
							  " implemented ", "EDGE_SELECTION");
			} else if(this.task.type == "VERTEX_COLORING") {
				console.error("game.component::onSubmit does not have",
							  " implemented ", "VERTEX_COLORING");
			} else if(this.task.type == "EDGE_COLORING") {
				console.error("game.component::onSubmit does not have",
							  " implemented ", "EDGE_COLORING");
			}
		}
	}

	private sendAnswer(json: string) {
		if(this.task.type == "DRAW") {
			this.taskService
				.postTaskAnswerDraw(json, this.task.taskUuid)
					.subscribe(response => {
						this.onAnswerResponse(response);
					});
		} else if(this.task.type == "VERTEX_SELECTION") {
			this.taskService
				.postTaskAnswerVertexSelection(json, this.task.taskUuid)
					.subscribe(response => {
						this.onAnswerResponse(response);
					});
		} else if(this.task.type == "EDGE_SELECTION") {
			console.warn("game.component::onSubmit does not have",
						  " implemented ", "EDGE_SELECTION");
		} else if(this.task.type == "VERTEX_COLORING") {
			console.error("game.component::onSubmit does not have",
						  " implemented ", "VERTEX_COLORING");
		} else if(this.task.type == "EDGE_COLORING") {
			console.error("game.component::onSubmit does not have",
						  " implemented ", "EDGE_COLORING");
		}
	}

	onNewTask() {
		this.gotResponseToAnswer = false;
		this.createAndFetchTask();
	}

	private onAnswerResponse(response: boolean) {
		this.answerIsCorrect = response;
		this.gotResponseToAnswer = true;
	}

	private extractGraphTask(task: GraphTask) {
		if(this.debugModeOn) {
			if(this.task.type == "VERTEX_SELECTION") {
				this.debugString = `{
					"selectedVertices": [0]
				}`;
			} else if(this.task.type == "DRAW") {
				this.debugString = `{
					"m": 0,
					"matrix": [
						[0]
					],
					"n": 0
				}`;
			}
		}
		if(this.taskRequiresGraph(task)) {
			//fetch graph
			this.taskService.getTaskGraph(task.taskUuid).subscribe(response => {
				this.graph = response;
				this.gameCanvas = new GameCanvas(this.task.type, this.graph);
			});
		} else {
			this.graph = new TaskGraph();
			this.graph.neighbourLists = [];
			this.gameCanvas = new GameCanvas(this.task.type, this.graph);
		}

		this.currentTaskSubject = TaskDescriptionsAndSubjects.SUBJECTS[task.subject];
		this.createTaskDescription(task);
	}

	private createTaskDescription(task: GraphTask): void {
		switch(this.currentTaskSubject) {
			case TaskDescriptionsAndSubjects.SUBJECTS["HYPERCUBES"]:
				this.currentTaskDescription = TaskDescriptionsAndSubjects.DESCRIPTIONS[task.subject + "_" + task.type]
			.replace("{}", Math.floor(Math.log2(task.graphVertices)).toString());
			break;
			case TaskDescriptionsAndSubjects.SUBJECTS["REGULAR_GRAPHS"]:
				this.currentTaskDescription = TaskDescriptionsAndSubjects.DESCRIPTIONS[task.subject + "_" + task.type]
			.replace("{}", task.graphVertices.toString())
			.replace("{k}", task.specialValues[0].toString());
			break;
			default:
				this.currentTaskDescription = TaskDescriptionsAndSubjects.DESCRIPTIONS[task.subject + "_" + task.type]
			.replace("{}", task.graphVertices.toString());
			break;
		}
	}

	private taskRequiresGraph(task: GraphTask): boolean {
		if(task.type == "DRAW") {
			return false;
		}
		return true;
	}

}
