import { ApplicationConfig, provideZoneChangeDetection, LOCALE_ID } from '@angular/core';
import { TitleStrategy, provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withInterceptors, withXhr } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localeDeCH from '@angular/common/locales/de-CH';
import { jwtInterceptor } from './core/interceptors/jwt.interceptor';
import { cacheInterceptor } from './core/interceptors/cache.interceptor';
import { provideApiConfiguration } from './api/api-configuration';
import { environment } from '../environments/environment';

import { AppTitleStrategy } from './core/title-strategy';

import { routes } from './app.routes';

registerLocaleData(localeDeCH);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' }),
    ),
    provideHttpClient(withXhr(), withInterceptors([cacheInterceptor, jwtInterceptor])),
    { provide: LOCALE_ID, useValue: 'de-CH' },
    provideApiConfiguration(environment.apiUrl),
    { provide: TitleStrategy, useClass: AppTitleStrategy },
  ]
};
