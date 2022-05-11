import {exhaustMap, take} from "rxjs";
import {UserStats} from "./user-stats.model";
import {environment} from "../../environments/environment";

export class User {
  constructor(
    public email: string,
    public username: string,
    public id: number,
    private _token: string,
    private _tokenExpirationDate: Date
  ) {
  }

  get token() {
    if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
      return null;
    }
    return this._token;
  }

}
