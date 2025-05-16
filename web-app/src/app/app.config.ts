import {APP_INITIALIZER, ApplicationConfig, Injectable, provideZoneChangeDetection} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {CommonModule} from '@angular/common';
import {MatPaginatorIntl} from '@angular/material/paginator';
import {IconsRegistryService} from '@services/icons-registry.service';
import { MAT_RIPPLE_GLOBAL_OPTIONS } from '@angular/material/core';
import { LoaderService } from './services/loader.service';
import { LoaderInterceptor } from './core/http/loader.interceptor';
import { AuthInterceptor } from './core/http/auth.interceptor';
import { ApiPrefixInterceptor } from './core/http/api-prefix.interceptor';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

@Injectable()
export class CustomPaginatorIntl extends MatPaginatorIntl {
  constructor() {
    super();

    this.itemsPerPageLabel = 'Элементов на странице:';
    this.nextPageLabel = 'след стр';
    this.previousPageLabel = 'пред стр';
    this.firstPageLabel = 'Первая страница';
    this.lastPageLabel = 'Последняя страница';
  }
}

export function initializeIcons(iconRegistryService: IconsRegistryService) {
  return () => iconRegistryService.registerIcons();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync('animations'),
    provideHttpClient(
      withInterceptorsFromDi()
    ),
    CommonModule,
    HttpClient,
    LoaderService,
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        subscriptSizing: 'dynamic'
      }
    },
    {
      provide: MatPaginatorIntl,
      useClass: CustomPaginatorIntl
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiPrefixInterceptor,
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeIcons,
      deps: [IconsRegistryService],
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    { provide: MAT_RIPPLE_GLOBAL_OPTIONS, useValue: { disabled: true } }
  ],
};
