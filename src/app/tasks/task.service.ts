import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {TaskSubjectList} from "./task-subject-list.model";
import {environment} from "../../environments/environment";
import {GraphTask} from "./graph-task.model";
import {TaskGraph} from "./task-graph";

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
    );
  }

  createTask(userId: number): Observable<any> {
    return this.http.post(
      environment.apiUrl + "/tasks/user/" + userId, {}
    );
  }

  getTaskGraph(uuid: string): Observable<TaskGraph> {
    return this.http.get<TaskGraph>(
      environment.apiUrl + "/graphs/task/" + uuid
    );
  }

  postTaskAnswerDraw(answer: string, uuid: string): Observable<boolean> {
    const options = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
    return this.http.post<boolean>(
      environment.apiUrl + "/tasks/answer/draw/" + uuid, answer, options
    );
  }

  postTaskAnswerVertexSelection(answer: string, uuid: string): Observable<boolean> {
    const options = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
    return this.http.post<boolean>(
      environment.apiUrl + "/tasks/answer/vertexSelection/" + uuid, answer, options
    );
  }

  postTaskAnswerEdgeSelection(answer: string, uuid: string): Observable<boolean> {
    const options = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
    return this.http.post<boolean>(
      environment.apiUrl + "/tasks/answer/edgeSelection/" + uuid, answer, options
    );
  }

}
