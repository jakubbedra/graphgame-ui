import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {TaskList} from "./task-list.model";
import {environment} from "../../environments/environment";

@Injectable()
export class TaskService {

  constructor(private http: HttpClient) {
  }

  getAllTasks(): Observable<TaskList> {
    return this.http.get<TaskList>(
      environment.apiUrl + "/tasks/subjects"
    );
  }

}
