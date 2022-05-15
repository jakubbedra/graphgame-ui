import {Component, OnInit} from '@angular/core';
import {TaskService} from "../tasks/task.service";
import {GraphTask} from "../tasks/graph-task.model";
import {parse, HtmlGenerator} from 'latex.js';
import {createHTMLWindow} from 'svgdom';
import {TaskDescriptionsAndSubjects} from "../tasks/task-descriptions-and-subjects";
import {TaskGraph} from "../tasks/task-graph";
import {GameCanvas} from "./game.canvas";

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

  testUserId = 1;

  task: GraphTask;
  graph: TaskGraph;
  gameCanvas: GameCanvas;

  constructor(
    private taskService: TaskService
  ) {
    this.debugString = "";
    this.debugModeOn = false;//true;
    this.gotResponseToAnswer = false;
    this.answerIsCorrect = false;
    this.currentTaskSubject = "sample text";
    this.currentTaskDescription = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";
	console.log("Construct GameComponent");
    this.gameCanvas = new GameCanvas();
  }

  ngOnInit(): void {
    this.tryToFetchTask();
  }

  tryToFetchTask() {
    this.taskService.getUserTask(this.testUserId).subscribe(response => {
      console.log(response);
      if (response.type == "UNDEFINED") {
        this.createAndFetchTask();
      } else {
        this.task = response;
        this.extractGraphTask(this.task);
      }
    });
  }

  createAndFetchTask() {
    this.taskService.createTask(this.testUserId).subscribe(response => {
      this.taskService.getUserTask(this.testUserId).subscribe(response => {
        this.task = response;
        this.extractGraphTask(this.task);
      });
    });
  }

  onSubmit() {
    if (this.debugModeOn) {
      //debug input in the form of textarea instead of canvas
      if (this.task.type == "DRAW") {
        this.taskService.postTaskAnswerDraw(this.debugString, this.task.taskUuid).subscribe(response => {
          this.onAnswerResponse(response);
        });
      } else if (this.task.type == "VERTEX_SELECTION") {
        console.log(this.debugString);
        this.taskService.postTaskAnswerVertexSelection(this.debugString, this.task.taskUuid).subscribe(response => {
          this.onAnswerResponse(response);
        });
      }
    } else {
      //todo: actual input from the player
    }
  }

  onNewTask() {
    this.gotResponseToAnswer = false;
    this.createAndFetchTask();
  }

  private onAnswerResponse(response: boolean) {
    console.log(response);
    this.answerIsCorrect = response;
    this.gotResponseToAnswer = true;
    //todo: disable input for canvas
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
      this.taskService.getTaskGraph(task.taskUuid).subscribe(response => {
        this.graph = response;
        console.log(response);
      });
    }

    this.currentTaskSubject = TaskDescriptionsAndSubjects.SUBJECTS[task.subject];
    this.currentTaskDescription = TaskDescriptionsAndSubjects.DESCRIPTIONS[task.subject + "_" + task.type]
      .replace("{}", task.graphVertices.toString());
//     this.gameCanvas.initTask(this.task.type, this.graph);
  }

  private taskRequiresGraph(task: GraphTask): boolean {
    if (task.type == "DRAW") {
      return false;
    }
    return true;
  }

}
