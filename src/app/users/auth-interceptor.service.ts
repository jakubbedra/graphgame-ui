import {Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest} from "@angular/common/http";
import {exhaustMap, Observable, take} from "rxjs";
import {AuthService} from "./auth.service";

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private authService: AuthService) {

  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.authService.user.pipe(
      take(1),
      exhaustMap(user => {
        if (!user) {
          return next.handle(req);
        }

        if (!req.url.includes('prolong_session')) {
          this.authService.prolongSession().subscribe();
        }

        const modifiedReq = req.clone({
          params: (req.params ? req.params : new HttpParams())
            .set('token', user.token)
        });
        return next.handle(modifiedReq);
      }));
  }

}
