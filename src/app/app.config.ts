import { APP_INITIALIZER, ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth.interceptor';
import { AuthService } from './services/auth.service';

import { routes } from './app.routes';

export function initializeApp(authService: AuthService) {
  return () => authService.me();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([authInterceptor])),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AuthService],
      multi: true
    }
  ]
};
