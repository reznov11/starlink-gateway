import {NavItem} from './nav-items';

export const MainNavItemsList: NavItem[] = [
  {
    title: 'Формы',
    route: '/dashboard/constructor',
    icon_name: 'custom_constructor',
    activate_roles: ['super_admin', 'employee']
  },
  {
    title: 'Компании',
    route: '/dashboard/partners',
    icon_name: 'custom_companies',
    activate_roles: ['super_admin', 'employee']
  },
  {
    title: 'Сотрудники',
    route: '/dashboard/users',
    icon_name: 'custom_employees',
    activate_roles: ['super_admin']
  },
  {
    title: 'Домены',
    route: '/dashboard/domains',
    icon_name: 'custom_globe',
    activate_roles: ['super_admin']
  }
];
