import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {TaskSubjectList} from "./task-subject-list.model";
import {environment} from "../../environments/environment";
import {GraphTask} from "./graph-task.model";

@Injectable()
export class TaskService {

  constructor(private http: HttpClient) {
  }

  getAllTaskSubjects(): Observable<TaskSubjectList> {
    return this.http.get<TaskSubjectList>(
      environment.apiUrl + "/tasks/subjects"
    );
  }

  getUserTask(userId: number): Observable<GraphTask> {
    return this.http.get<GraphTask>(
      environment.apiUrl + "/tasks/user/" + userId
    );//todo: also fetch graph and if 404 return null
  }

  createTask(userId: number): Observable<any> {
    return this.http.post(
      environment.apiUrl + "/tasks/user/" + userId, {}
    );
  }

}
