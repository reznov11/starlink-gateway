import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '@pages/login/login.component';
import {DashboardShell} from '@components/side-nav/side-nav.service';
import { AuthorizedUserGuard } from '@guards/authorized.guard';
import {AccessDeniedComponent} from '@pages/access-denied/access-denied.component';
import {LogoutComponent} from '@pages/logout/logout.component';
import {RoleGuard} from '@guards/role.guard';
import { PortalComponent } from '@pages/portal/portal.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    data: { title: 'Авторизция'}
  },
  {
    path: 'partner',
    component: PortalComponent,
    data: { title: 'Партнёрский портал'}
  },
  DashboardShell.childRoutes([
    {
      path: 'dashboard',
      children: [
        {
          path: '',
          pathMatch: 'full',
          redirectTo: 'constructor',
        },
        {
          path: 'access-denied',
          component: AccessDeniedComponent,
          canActivate: [AuthorizedUserGuard],
          data: { title: 'Доступ закрыть' },
        },
        {
          path: 'constructor',
          loadChildren: () => import('@pages/forms-constructor/forms-constructor.routes').then((m) => m.routes),
          canActivate: [AuthorizedUserGuard, RoleGuard],
          data: { roles: ['super_admin', 'employee'] },
        },
        {
          path: 'partners',
          loadChildren: () => import('@pages/partners/partners.routes').then((m) => m.routes),
          canActivate: [AuthorizedUserGuard, RoleGuard],
          data: { roles: ['super_admin'], title: 'Компании' },
        },
        {
          path: 'users',
          loadChildren: () => import('@pages/users/users.routes').then((m) => m.routes),
          canActivate: [AuthorizedUserGuard, RoleGuard],
          data: { roles: ['super_admin'] }
        },
        {
          path: 'domains',
          loadChildren: () => import('@pages/domains/domains.routes').then((m) => m.routes),
          canActivate: [AuthorizedUserGuard, RoleGuard],
          data: { roles: ['super_admin'] }
        },
        {
          path: 'logout',
          component: LogoutComponent,
          canActivate: [AuthorizedUserGuard],
        },
      ]
    },
    {
      path: '**',
      redirectTo: '/dashboard/constructor',
      pathMatch: 'full',
    },
  ])
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
