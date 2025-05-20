import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpEvent } from '@angular/common/http';
import { HttpRequest } from '@angular/common/http';
import { HttpHandler } from '@angular/common/http';
import { HttpInterceptor } from '@angular/common/http';
import { LoaderService } from '@app/services/loader.service';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  constructor(public loaderService: LoaderService) {}
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.includes('/api/partners/portal/')) {
      return next.handle(req);
    }

    this.loaderService.isLoading.next(true);
    return next.handle(req).pipe(finalize(() => this.loaderService.isLoading.next(false)));
  }
}