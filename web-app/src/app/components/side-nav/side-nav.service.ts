import { Routes, Route } from '@angular/router';
import {SideNavComponent} from './side-nav.component';

export class DashboardShell {
  static childRoutes(routes: Routes): Route {
    return {
      path: '',
      component: SideNavComponent,
      children: routes,
      data: { reuse: true }
    };
  }
}
