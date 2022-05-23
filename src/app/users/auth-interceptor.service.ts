import {Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest} from "@angular/common/http";
import {exhaustMap, Observable, take} from "rxjs";
import {AuthService} from "./auth.service";

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  prolongCounter = 0;

  constructor(private authService: AuthService) {

  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.authService.user.pipe(
      take(1),
      exhaustMap(user => {
        if (!user) {
          return next.handle(req);
        }

        if (!req.url.includes('prolong_session') && this.prolongCounter % 4 == 0) {
          this.authService.prolongSession(user.token).subscribe();
        }

        this.prolongCounter++;
        if (this.prolongCounter >= 4) {
          this.prolongCounter = 0;
        }

        const modifiedReq = req.clone({
          params: new HttpParams().set('token', user.token)
        });
        return next.handle(modifiedReq);
      }));
  }

}
