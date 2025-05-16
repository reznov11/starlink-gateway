import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '@app/services/auth.service';

export const UserRole = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  EMPLOYEE: 'employee',
  UNKNOWN: 'unknown',
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

export const UserRoleReadable: Record<string, string> = {
  [UserRole.SUPER_ADMIN]: 'Суперадминистратор',
  [UserRole.ADMIN]: 'Администратор',
  [UserRole.EMPLOYEE]: 'Сотрудник',
  [UserRole.UNKNOWN]: 'Неизвестен',
};

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
    constructor(
        private auth: AuthService,
        private router: Router,
        private snackBar: MatSnackBar
    ) { }

    canActivate(route: ActivatedRouteSnapshot): boolean {
      const expectedRoles = route.data['roles'] as UserRole[];
      let userRole = this.auth.currentUserProfile?.role;

      if (!userRole) {
        this.auth.fetchUserProfile().subscribe(async (data: any) => {
            if (!expectedRoles.includes(<"super_admin" | "admin" | "employee">data.role)) {
              await this.snackBar.open('Доступ закрыт.', 'Close', { duration: 3000 });
              await this.router.navigate(['/dashboard/access-denied']);
            }
          },
        );
      }

      return true;
    }
}
