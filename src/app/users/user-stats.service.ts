import {HttpClient} from "@angular/common/http";
import {exhaustMap, Observable, take} from "rxjs";
import {UserStats} from "./user-stats.model";
import {UserStatsList} from "./usr-stats-list.model";
import {environment} from "../../environments/environment";
import {Injectable} from "@angular/core";
import {AuthService} from "./auth.service";

@Injectable()
export class UserStatsService {

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
  }

  getUserStatsTask(
    taskId: string, startDate?: string, endDate?: string
  ): Observable<UserStats> {
    if (startDate === undefined || endDate === undefined) {
      return this.authService.user.pipe(take(1), exhaustMap(user => {
        return this.http.get<UserStats>(
          environment.apiUrl + "/users/" + user.id + "/stats/" + taskId
        );
      }));
    } else {
      return this.authService.user.pipe(take(1), exhaustMap(user => {
        return this.http.get<UserStats>(
          environment.apiUrl + "/users/" + user.id + "/stats/" + taskId,
          {params: {startDate: startDate, endDate: endDate}}
        );
      }));
    }
  }

  getUserStatsListOverall(
    startDate?: string, endDate?: string
  ): Observable<UserStatsList> {
    if (startDate === undefined || endDate === undefined) {
      return this.authService.user.pipe(take(1), exhaustMap(user => {
        return this.http.get<UserStatsList>(
          environment.apiUrl + "/users/" + user.id + "/stats/list"
        );
      }));
    } else {
      return this.authService.user.pipe(take(1), exhaustMap(user => {
        return this.http.get<UserStatsList>(
          environment.apiUrl + "/users/" + user.id + "/stats/list",
          {params: {startDate: startDate, endDate: endDate}}
        );
      }));
    }
  }

  getUserStatsListTask(
    taskId: string, startDate?: string, endDate?: string
  ): Observable<UserStatsList> {
    if (startDate === undefined || endDate === undefined) {
      return this.authService.user.pipe(take(1), exhaustMap(user => {
        return this.http.get<UserStatsList>(
          environment.apiUrl + "/users/" + user.id + "/stats/" + taskId + "/list"
        );
      }));
    } else {
      return this.authService.user.pipe(take(1), exhaustMap(user => {
        return this.http.get<UserStatsList>(
          environment.apiUrl + "/users/" + user.id + "/stats/" + taskId + "/list",
          {params: {startDate: startDate, endDate: endDate}}
        );
      }));
    }
  }

}
