import { Routes } from '@angular/router';
import {FormsConstructorComponent} from '@pages/forms-constructor/forms-constructor.component';
import { CreateFormComponent } from './create-form/create-form.component';

export const routes: Routes = [
  {
    path: '',
    component: FormsConstructorComponent,
    data: { title: 'Формы' },
  },
  {
    path: 'create',
    component: CreateFormComponent,
    data: { title: 'Создание формы' },
  },
  {
    path: 'edit/:formId',
    component: CreateFormComponent,
    data: { title: 'Редактор формы' },
  }
];
