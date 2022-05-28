import {Component, OnInit} from '@angular/core';
import {TopUser} from "../top-user.model";
import {TopUsersService} from "../top-users.service";
import {TaskService} from "../../tasks/task.service";
import {TaskSubject} from "../../tasks/task-type.model";
import {AuthService} from "../auth.service";

@Component({
  selector: 'app-top-users',
  templateUrl: './top-users.component.html',
  styleUrls: ['./top-users.component.css']
})
export class TopUsersComponent implements OnInit {

  tasks: TaskSubject[];
  topUsers: TopUser[];

  selectedTimePeriod: string;
  selectedTaskSubject: string;

  page: number;
  userId: number;

  constructor(
    private userStatsService: TopUsersService,
    private taskService: TaskService,
    private authService: AuthService
  ) {
    this.selectedTimePeriod = "all time";
    this.selectedTaskSubject = "all";
    this.page = 1;
    this.userId = -1;
  }

  ngOnInit(): void {
    this.authService.user.subscribe(user => {
      if(!!user){
        this.userId = user.id;
      } else {
        this.userId = -1;
      }
    });
    this.fetchTopUsersOverallPage(this.page);
    this.fetchTasks();
  }

  fetchTasks(): void {
    this.taskService.getAllTaskSubjects().subscribe(responseData => {
      this.tasks = responseData.subjects;
      console.log(this.tasks);
    });
  }

  fetchTopUsersOverallPage(page: number): void {
    if (this.selectedTimePeriod === "all time") {
      this.userStatsService.getTopUsersOverall(page).subscribe(responseData => {
        this.topUsers = responseData.topUsers;
        this.page = page;
      });
    } else if (this.selectedTimePeriod === "today") {
      this.userStatsService.getTopUsersOverallToday(page).subscribe(responseData => {
        this.topUsers = responseData.topUsers;
        this.page = page;
      });
    }
  }

  fetchTopUsersByTaskPage(page: number): void {
    if (this.selectedTimePeriod === "all time") {
      this.userStatsService.getTopUsersByTask(this.selectedTaskSubject, page).subscribe(responseData => {
        this.topUsers = responseData.topUsers;
        this.page = page;
      });
    } else if (this.selectedTimePeriod === "today") {
      this.userStatsService.getTopUsersByTaskToday(this.selectedTaskSubject, page).subscribe(responseData => {
        this.topUsers = responseData.topUsers;
        this.page = page;
      });
    }
  }

  onChangeOption() {
    console.log(this.selectedTaskSubject);
    if (this.selectedTaskSubject == "all") {
      this.fetchTopUsersOverallPage(this.page);
    } else {
      this.fetchTopUsersByTaskPage(this.page);
    }
    console.log(this.selectedTimePeriod);
  }

  onNextPage() {
    if (this.selectedTimePeriod == 'all time') {
      this.fetchTopUsersOverallPage(this.page + 1);
    } else {
      this.fetchTopUsersByTaskPage(this.page + 1);
    }
  }

  onPrevPage() {
    if (this.page > 1) {
      if (this.selectedTimePeriod == 'all time') {
        this.fetchTopUsersOverallPage(this.page - 1);
      } else {
        this.fetchTopUsersByTaskPage(this.page - 1)
      }
    }
  }

  getTaskNameById(value: string): string {
    for (let t of this.tasks) {
      if (t.value == value) {
        return t.label;
      }
    }
    return 'every task';
  }

}
