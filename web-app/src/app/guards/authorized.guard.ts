import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import {AuthService} from '@services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthorizedUserGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.authService.fetchUserProfile().pipe(
      map((data: any) => {
        if (this.authService.isAuthenticated!) {
          return true;
        } else {
          this.handleUnauthorized(data.error?.detail || 'Доступ запрещен');
          return false;
        }
      }),

      catchError((error: any) => {
        if (error.status === 403 || error.status === 401 || error.status === 404) {
          this.handleUnauthorized(
            error.error?.detail ||
            'Сессия истекла или прав не хватает. Пожалуйста, войдите снова.'
          );
        }

        if (error.status === 500) {
          this.handleServerError(
            error.error?.detail ||
            'Серверная ошибка. Пожалуйста, повотрите попытку позже.'
          );
        }

        return of(false);
      })
    );
  }

  private handleUnauthorized(message: string): void {
    this.toast(message);
    this.authService.cleanToken();
    this.router.navigate(['/login']);
  }

  private handleServerError(message: string): void {
    this.toast(message);
  }

  private toast(message: string): void {
    this.snackBar.open(
      message,
      'Закрыть',
      { duration: 3000, verticalPosition: 'top' }
    );
  }
}
