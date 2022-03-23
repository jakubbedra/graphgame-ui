import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {TopUserList} from "./top-user-list.model";

@Injectable()
export class UserStatsService {

  constructor(private http: HttpClient) {
  }

  getTopUsersOverall(page: number): Observable<TopUserList> {
    return this.http.get<TopUserList>(
      environment.apiUrl + "/users/topChart/overall/" + page, {}
    );
  }

}
