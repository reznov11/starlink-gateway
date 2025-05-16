import {UserRole} from '@guards/role.guard';

export interface NavItem {
  title: string;
  route: string;
  icon_name: string;
  icon_path?: string;
  activate_roles?: UserRole[],
  no_role?: boolean
}
