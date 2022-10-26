import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {TaskSubjectList} from "./task-subject-list.model";
import {environment} from "../../environments/environment";
import {GraphTask} from "./graph-task.model";
import {TaskGraph} from "./task-graph";
import {WeightedGraph} from "./weighted-graph.model";

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

  createTask(userId: number, subject: string): Observable<any> {
    let subjectUrl: string = subject == "all" ? "" : "?subject=" + subject;
    return this.http.post(
      environment.apiUrl + "/tasks/user/" + userId + subjectUrl, {}
    );
  }

  getTaskGraph(uuid: string): Observable<TaskGraph> {
    return this.http.get<TaskGraph>(
      environment.apiUrl + "/graphs/task/" + uuid
    );
  }

  getTaskWeightedGraph(uuid: string): Observable<WeightedGraph> {
    return this.http.get<WeightedGraph>(
      environment.apiUrl + "/graphs/weighted/task/" + uuid
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

  postTaskAnswerBoolean(answer: string, uuid: string): Observable<boolean> {
    const options = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
    return this.http.post<boolean>(
      environment.apiUrl + "/tasks/answer/boolean/" + uuid, answer, options
    );
  }

  postTaskAnswerVertexColoring(answer: string, uuid: string): Observable<boolean> {
    const options = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
    return this.http.post<boolean>(
      environment.apiUrl + "/tasks/answer/vertexColoring/" + uuid, answer, options
    );
  }

  postTaskAnswerEdgeColoring(answer: string, uuid: string): Observable<boolean> {
    const options = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
    return this.http.post<boolean>(
      environment.apiUrl + "/tasks/answer/edgeColoring/" + uuid, answer, options
    );
  }

}
