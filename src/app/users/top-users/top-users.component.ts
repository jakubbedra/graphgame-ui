import {Component, OnInit} from '@angular/core';
import {TopUser} from "../top-user.model";
import {UserStatsService} from "../user-stats.service";
import {TaskService} from "../../tasks/task.service";
import {TaskType} from "../../tasks/task-type.model";

@Component({
  selector: 'app-top-users',
  templateUrl: './top-users.component.html',
  styleUrls: ['./top-users.component.css']
})
export class TopUsersComponent implements OnInit {

  tasks: TaskType[];
  topUsers: TopUser[];

  selectedTimePeriod: string;
  selectedTaskType: number;

  page: number;

  constructor(
    private userStatsService: UserStatsService,
    private taskService: TaskService
  ) {
    this.selectedTimePeriod = "all time";
    this.selectedTaskType = -1;
    this.page = 1;
  }

  ngOnInit(): void {
    this.fetchTopUsersOverallPage(this.page);
    this.fetchTasks();
  }

  fetchTasks(): void {
    this.taskService.getAllTasks().subscribe(responseData => {
      this.tasks = responseData.tasks;
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
      this.userStatsService.getTopUsersByTask(this.selectedTaskType, page).subscribe(responseData => {
        this.topUsers = responseData.topUsers;
        this.page = page;
      });
    } else if (this.selectedTimePeriod === "today") {
      this.userStatsService.getTopUsersByTaskToday(this.selectedTaskType, page).subscribe(responseData => {
        this.topUsers = responseData.topUsers;
        this.page = page;
      });
    }
  }

  onChangeOption() {
    console.log(this.selectedTaskType);
    if (this.selectedTaskType == -1) {
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

  getTaskNameById(id: number): string {
    for (let t of this.tasks) {
      if (t.id == id) {
        return t.name;
      }
    }
    return 'every task';
  }

}
