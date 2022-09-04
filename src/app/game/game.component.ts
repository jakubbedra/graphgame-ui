import {Component, OnInit} from '@angular/core';
import {TaskService} from "../tasks/task.service";
import {GraphTask} from "../tasks/graph-task.model";
import {TaskDescriptionsAndSubjects} from "../tasks/task-descriptions-and-subjects";
import {TaskGraph} from "../tasks/task-graph";
import {GameCanvas} from "./game.canvas";
import {AuthService} from "../users/auth.service";
import {Observable, take} from "rxjs";
import {User} from "../users/user.auth.model";
import {Edge} from "../tasks/edge.model";
import {WeightedGraph} from "../tasks/weighted-graph.model";

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
  booleanTaskAnswer: boolean;

  currentTaskSubject: string;
  currentTaskDescription: string; //todo: config file containing the descriptions

  //testUserId = 1;
  userId = -1;

  task: GraphTask;
  graph: TaskGraph;
  weightedGraph: WeightedGraph;
  gameCanvas: GameCanvas;

  constructor(
    private taskService: TaskService,
    private authService: AuthService
  ) {
    this.booleanTaskAnswer = false;
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
      if (response.type == "UNDEFINED") {
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

  onSubmitBoolean(answer: boolean) {
    this.booleanTaskAnswer = answer;
    this.onSubmit();
  }

  onSubmit() {
    if (this.debugModeOn) {
      //debug input in the form of textarea instead of canvas
      if (this.task.type == "DRAW") {
        this.taskService.postTaskAnswerDraw(this.debugString, this.task.taskUuid).subscribe(response => {
          this.onAnswerResponse(response);
        });
      } else if (this.task.type == "VERTEX_SELECTION") {
        this.taskService.postTaskAnswerVertexSelection(this.debugString, this.task.taskUuid).subscribe(response => {
          this.onAnswerResponse(response);
        });
      }
    } else {
      if (this.task.type == "DRAW") {
        let matrix = this.gameCanvas.getNeighbouringMatrix();
        let m = 0;
        for (let a of matrix) {
          for (let b of a) {
            if (b != 0) {
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
      } else if (this.task.type == "VERTEX_SELECTION") {
        let json = {
          selectedVertices: this.gameCanvas.vertexSelectionStack
        };
        this.sendAnswer(JSON.stringify(json));
      } else if (this.task.type == "EDGE_SELECTION") {
        let edges: Edge[] = [];
        this.gameCanvas.edgeSelectionStack.forEach(e => {
          edges.push(new Edge(e[0], e[1], this.gameCanvas.weightsMatrix === null ? 1 : this.gameCanvas.weightsMatrix[e[0]][e[1]]));
        });
        let json = {
          selectedEdges: edges
        };
        //todo
        console.log(json);

        this.sendAnswer(JSON.stringify(json));
      } else if (this.task.type == "VERTEX_COLORING") {
        let json = {
          colors: this.gameCanvas.getVertexColoring()
        };
        this.sendAnswer(JSON.stringify(json));
      } else if (this.task.type == "EDGE_COLORING") {
        let json = {
          colors: this.gameCanvas.getEdgeColoringMatrix()
        };
        this.sendAnswer(JSON.stringify(json));
      } else if (this.task.type == "BOOLEAN") {
        this.sendAnswer(JSON.stringify({answer: this.booleanTaskAnswer}));
      }
    }
  }

  private sendAnswer(json: string) {
    if (this.task.type == "DRAW") {
      this.taskService
        .postTaskAnswerDraw(json, this.task.taskUuid)
        .subscribe(response => {
          this.onAnswerResponse(response);
        });
    } else if (this.task.type == "VERTEX_SELECTION") {
      this.taskService
        .postTaskAnswerVertexSelection(json, this.task.taskUuid)
        .subscribe(response => {
          this.onAnswerResponse(response);
        });
    } else if (this.task.type == "EDGE_SELECTION") {
      this.taskService
        .postTaskAnswerEdgeSelection(json, this.task.taskUuid)
        .subscribe(response => {
          this.onAnswerResponse(response);
        });
    } else if (this.task.type == "VERTEX_COLORING") {
      this.taskService
        .postTaskAnswerVertexColoring(json, this.task.taskUuid)
        .subscribe(response => {
          this.onAnswerResponse(response);
        });
    } else if (this.task.type == "EDGE_COLORING") {

      // todo
      console.log(json);

      this.taskService
        .postTaskAnswerEdgeColoring(json, this.task.taskUuid)
        .subscribe(response => {
          this.onAnswerResponse(response);
        });
    } else if (this.task.type == "BOOLEAN") {
      this.taskService
        .postTaskAnswerBoolean(json, this.task.taskUuid)
        .subscribe(response => {
          this.onAnswerResponse(response);
        });
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
    if (this.debugModeOn) {
      if (this.task.type == "VERTEX_SELECTION") {
        this.debugString = `{
					"selectedVertices": [0]
				}`;
      } else if (this.task.type == "DRAW") {
        this.debugString = `{
					"m": 0,
					"matrix": [
						[0]
					],
					"n": 0
				}`;
      }
    }
    if (this.taskRequiresGraph(task)) {
      //fetch graph
      if (!task.graphWeighted) {
        this.weightedGraph = null;
        this.taskService.getTaskGraph(task.taskUuid).subscribe(response => {
          this.graph = response;
          this.gameCanvas = new GameCanvas(this.task.type, this.graph);
        });
      } else {
        this.graph = null;
        this.taskService.getTaskWeightedGraph(task.taskUuid).subscribe(response => {
          this.weightedGraph = response;
          this.gameCanvas = new GameCanvas(this.task.type, null, this.weightedGraph);
          /**
           * TODO: this shit + sending answer dto (add edge weight)
           */
        });
      }
    } else {
      this.graph = new TaskGraph();
      this.graph.neighbourLists = [];
      this.gameCanvas = new GameCanvas(this.task.type, this.graph);
    }

    this.currentTaskSubject = TaskDescriptionsAndSubjects.SUBJECTS[task.subject];
    this.createTaskDescription(task);
  }

  private createTaskDescription(task: GraphTask): void {
    switch (this.currentTaskSubject) {
      case TaskDescriptionsAndSubjects.SUBJECTS["HYPERCUBES"]:
        this.currentTaskDescription = TaskDescriptionsAndSubjects.DESCRIPTIONS[task.subject + "_" + task.type]
          .replace("{}", Math.floor(Math.log2(task.graphVertices)).toString());
        break;
      case TaskDescriptionsAndSubjects.SUBJECTS["REGULAR_GRAPHS"]:
        this.currentTaskDescription = TaskDescriptionsAndSubjects.DESCRIPTIONS[task.subject + "_" + task.type]
          .replace("{}", task.graphVertices.toString())
          .replace("{k}", task.specialValues[0].toString());
        break;
      case TaskDescriptionsAndSubjects.SUBJECTS["BIPARTITE_GRAPHS"]:
        this.currentTaskDescription = TaskDescriptionsAndSubjects.DESCRIPTIONS[task.subject + "_" + task.type]
          .replace("{r}", task.specialValues[0].toString())
          .replace("{s}", task.specialValues[1].toString());
        break;
      case TaskDescriptionsAndSubjects.SUBJECTS["NAMED_GRAPHS"]:
        this.currentTaskDescription = TaskDescriptionsAndSubjects.DESCRIPTIONS[task.subject + "_" + task.type]
          .replace("{gn}", task.descriptionDetails);
        break;
      case TaskDescriptionsAndSubjects.SUBJECTS["TRIVIAL_QUESTIONS"]:
        if (task.type === 'DRAW' && task.descriptionDetails === 'Empty Graph') {
          this.currentTaskDescription = TaskDescriptionsAndSubjects.DESCRIPTIONS[task.subject + "_" + task.type]
            .replace("{}", "$N_{" + task.graphVertices + "}$");
        } else if (task.type === 'VERTEX_SELECTION') {
          this.currentTaskDescription = TaskDescriptionsAndSubjects.DESCRIPTIONS[task.subject + "_" + task.type]
            .replace("{}", task.descriptionDetails);
        }
        break;
      case TaskDescriptionsAndSubjects.SUBJECTS["DISTANCES"]:
        if (task.type === 'VERTEX_SELECTION') {
          this.currentTaskDescription = TaskDescriptionsAndSubjects.DESCRIPTIONS[task.subject + "_" + task.type]
            .replace("{v}", task.specialValues.length > 0 ? " starting with the vertex " + task.specialValues[0] : "")
            .replace("{d}", (task.specialValues.length > 0 ? "its " : "the graph's ") + task.descriptionDetails);
        }
        break;
      default:
        this.currentTaskDescription = TaskDescriptionsAndSubjects.DESCRIPTIONS[task.subject + "_" + task.type]
          .replace("{}", task.graphVertices.toString());
        break;
    }
  }

  private taskRequiresGraph(task: GraphTask): boolean {
    return task.type != "DRAW";
  }

}
