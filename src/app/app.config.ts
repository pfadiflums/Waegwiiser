import { ApplicationConfig, provideZoneChangeDetection, LOCALE_ID } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localeDeCH from '@angular/common/locales/de-CH';
import { jwtInterceptor } from './interceptors/jwt.interceptor';
import { cacheInterceptor } from './interceptors/cache.interceptor';

import { routes } from './app.routes';

registerLocaleData(localeDeCH);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([cacheInterceptor, jwtInterceptor])),
    { provide: LOCALE_ID, useValue: 'de-CH' },
  ]
};
