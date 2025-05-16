import { Routes } from '@angular/router';
import {DomainsComponent} from '@pages/domains/domains.component';

export const routes: Routes = [
  {
    path: '',
    component: DomainsComponent,
    data: { title: 'Домены' },
  },
];
