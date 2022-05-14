import {Component, OnInit} from '@angular/core';
import {TaskService} from "../tasks/task.service";
import {GraphTask} from "../tasks/graph-task.model";
import { parse, HtmlGenerator } from 'latex.js';
import { createHTMLWindow } from 'svgdom';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  currentTaskSubject: string;
  currentTaskDescription: string; //todo: config file containing the descriptions

  testUserId = 1;

  constructor(
    private taskService: TaskService
  ) {
    this.currentTaskSubject = "sample text";
    this.currentTaskDescription = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";
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
        //todo
      }
    });
  }

  createAndFetchTask() {
    this.taskService.createTask(this.testUserId).subscribe(response => {
      this.taskService.getUserTask(this.testUserId).subscribe(response => {
        this.extractGraphTask(response);
      });
    });
  }

  //maybe do a service instead???
  private extractGraphTask(task: GraphTask) {
    //todo: if task requires graph then also fetch it...
/*
    let latex = "Hi, this is a line of text."

    let generator = new HtmlGenerator({ hyphenate: false })

    let doc = parse(latex, { generator: generator }).htmlDocument()

    console.log(doc.documentElement.outerHTML)
  */

  }

}
