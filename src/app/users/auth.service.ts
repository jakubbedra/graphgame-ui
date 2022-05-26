import {Injectable} from "@angular/core";
import {BehaviorSubject, exhaustMap, interval, Observable, Subject, switchMap, take, tap} from "rxjs";
import {User} from "./user.auth.model";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment";

export interface AuthResponseData {
  username: string;
  user_id: number;
  _token: string;
  _tokenExpirationTime: string;
}

@Injectable()
export class AuthService {
  user = new BehaviorSubject<User>(null);

  constructor(private http: HttpClient) {
  }

  prolongSession(): Observable<any> {
    return this.user.pipe(
      take(1),
      exhaustMap(user => {
        console.log("dupa");
        return this.http.put(environment.apiUrl + "/users/prolong_session", {});
      }));
  }

  register(username: string, email: string, password: string) {
    return this.http.post<AuthResponseData>(
      environment.apiUrl + "/users",
      {
        email,
        username,
        password
      }
    );
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      environment.apiUrl + "/users/login",
      {
        email,
        password
      }
    ).pipe(
      tap(resData => {
        this.handleAuthentication(
          email,
          resData.username,
          resData.user_id,
          resData._token,
          resData._tokenExpirationTime
        )
      })
    );
  }

  logout() {
    return this.user.pipe(take(1), exhaustMap(user => {
      this.user.next(null);
      return this.http.delete(
        environment.apiUrl + "/users/logout"
      );
    }));
  }

  private handleAuthentication(
    email: string, username: string, user_id: number, token: string, expiresIn: string
  ) {
    const expirationDate = new Date(
      expiresIn
    );
    const user = new User(
      email,
      username,
      user_id,
      token,
      expirationDate
    );
    this.user.next(user);
  }

}
