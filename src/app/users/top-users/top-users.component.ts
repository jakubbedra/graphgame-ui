import { Component, OnInit } from '@angular/core';
import {TopUser} from "../top-user.model";
import {UserStatsService} from "../user-stats.service";

@Component({
  selector: 'app-top-users',
  templateUrl: './top-users.component.html',
  styleUrls: ['./top-users.component.css']
})
export class TopUsersComponent implements OnInit {

  topUsers: TopUser[];

  timePeriod: string;
  taskType: string;

  constructor(
    private userStatsService: UserStatsService
  ) {
    this.timePeriod = "all time";
    this.taskType = "every task";
  }

  ngOnInit(): void {
    this.userStatsService.getTopUsersOverall(1).subscribe(responseData => {
      this.topUsers = responseData.topUsers;
    });
  }

}
