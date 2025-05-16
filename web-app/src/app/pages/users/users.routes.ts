import { Routes } from '@angular/router';
import {UsersListComponent} from '@pages/users/users-list.component';
import {RoleGuard} from '@guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    component: UsersListComponent,
    data: { title: 'Сотрудники' },
  },
  {
    path: 'logout',
    loadComponent: () =>
      import('../logout/logout.component').then((m) => m.LogoutComponent),
  },
  {
    path: 'profile',
    loadComponent: () => import('./profile/user-profile.component').then(m => m.UserProfileComponent),
    data: { title: 'Профиль' },
  }
];
