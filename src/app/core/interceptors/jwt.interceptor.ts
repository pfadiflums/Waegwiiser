import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthStore } from '../store/auth.store';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authStore = inject(AuthStore);
  const token = authStore.getToken();

  const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};
  req = req.clone({ setHeaders: headers, withCredentials: true });

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        authStore.handleUnauthorized();
      }
      return throwError(() => error);
    }),
  );
};
