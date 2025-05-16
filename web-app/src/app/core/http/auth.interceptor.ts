// auth.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService, UserProfile } from '@app/services/auth.service';
import { ProgressService } from '@app/services/progress-bar.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private progService: ProgressService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const accessToken = this.authService.getAccessToken();

    if (!accessToken || request.url.includes('/auth/login')) {
      return next.handle(request);
    }

    const authReq = request.clone({
      setHeaders: {
        Authorization: `Token ${accessToken}`
      }
    });

    return next.handle(authReq);
  }
}
