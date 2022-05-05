import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {UserStats} from "./user-stats.model";
import {UserStatsList} from "./usr-stats-list.model";
import {environment} from "../../environments/environment";
import {Injectable} from "@angular/core";

@Injectable()
export class UserStatsService {

  constructor(private http: HttpClient) {
  }

  getUserStatsTask(
    userId: number, taskId: string, startDate?: string, endDate?: string
  ): Observable<UserStats> {
    if (startDate === undefined || endDate === undefined) {
      return this.http.get<UserStats>(
        environment.apiUrl + "/users/" + userId + "/stats/" + taskId
      );
    } else {
      return this.http.get<UserStats>(
        environment.apiUrl + "/users/" + userId + "/stats/" + taskId,
        {params: {startDate: startDate, endDate: endDate}}
      );
    }
  }

  getUserStatsListOverall(
    userId: number, startDate?: string, endDate?: string
  ): Observable<UserStatsList> {
    if (startDate === undefined || endDate === undefined) {
      return this.http.get<UserStatsList>(
        environment.apiUrl + "/users/" + userId + "/stats/list"
      );
    } else {
      return this.http.get<UserStatsList>(
        environment.apiUrl + "/users/" + userId + "/stats/list",
        {params: {startDate: startDate, endDate: endDate}}
      );
    }
  }

  getUserStatsListTask(
    userId: number, taskId: string, startDate?: string, endDate?: string
  ): Observable<UserStatsList> {
    if (startDate === undefined || endDate === undefined) {
      return this.http.get<UserStatsList>(
        environment.apiUrl + "/users/" + userId + "/stats/" + taskId + "/list"
      );
    } else {
      return this.http.get<UserStatsList>(
        environment.apiUrl + "/users/" + userId + "/stats/" + taskId + "/list",
        {params: {startDate: startDate, endDate: endDate}}
      );
    }
  }

}
