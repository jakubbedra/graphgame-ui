import {Injectable} from "@angular/core";
import {BehaviorSubject, exhaustMap, Observable, take, tap} from "rxjs";
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
        return this.http.put(environment.apiUrl + "/users/prolong_session", {});
      }));
  }

  register(username: string, password: string) {
    return this.http.post<AuthResponseData>(
      environment.apiUrl + "/users",
      {
        username,
        password
      }
    );
  }

  login(username: string, password: string) {
    return this.http.post<AuthResponseData>(
      environment.apiUrl + "/users/login",
      {
        username,
        password
      }
    ).pipe(
      tap(resData => {
        if (resData != null) {
          this.handleAuthentication(
            resData.username,
            resData.user_id,
            resData._token,
            resData._tokenExpirationTime
          )
        } else {
          return null;
        }
      })
    );
  }

  logout() {
    return this.user.pipe(take(1), exhaustMap(user => {
      this.user.next(null);
      //note: only place where the token won't be attached by interceptor because the user will already be null
      return this.http.delete(
        environment.apiUrl + "/users/logout?token=" + user.token
      );
    }));
  }

  private handleAuthentication(
    username: string, user_id: number, token: string, expiresIn: string
  ) {
    const expirationDate = new Date(
      expiresIn
    );
    const user = new User(
      username,
      user_id,
      token,
      expirationDate
    );
    this.user.next(user);
  }

}
