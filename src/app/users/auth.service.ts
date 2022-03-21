import {Injectable} from "@angular/core";
import {catchError, Subject, tap} from "rxjs";
import {User} from "./user.model";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

export interface AuthResponseData {
  username: string;
  _token: string;
  _tokenExpiresIn: string;
}

@Injectable()
export class AuthService {
  user = new Subject<User>();

  constructor(private http: HttpClient) {
  }

  signup(username: string, email: string, password: string) {

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
          resData._token,
          +resData._tokenExpiresIn
        )
      })
    );
  }

  private handleAuthentication(email: string, username: string, token: string, expiresIn: number) {
    const expirationDate = new Date(
      new Date().getTime() + expiresIn * 1000
    );
    const user = new User(
      email,
      username,
      token,
      expirationDate
    );
    this.user.next(user);
  }

}
