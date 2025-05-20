import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiPrefixInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const isAbsoluteUrl = /^(http|https):/i.test(request.url);
    const isAssetRequest = request.url.startsWith('/assets/');

    if (!isAbsoluteUrl && !isAssetRequest) {
      let api: any = 'internal';

      if (
        request.body &&
        request.body.api &&
        environment.api[request.body.api as keyof typeof environment.api]
      ) {
        api = request.body.api as keyof typeof environment.api;
        delete request.body.api;
      }

      request = request.clone({
        url: environment.api + request.url,
      });
    }

    return next.handle(request);
  }
}
