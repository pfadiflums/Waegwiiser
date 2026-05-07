import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthStore } from '../store/auth.store';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authStore = inject(AuthStore);
  const token = authStore.getToken();

  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        authStore.handleUnauthorized();
      }
      return throwError(() => error);
    }),
  );
};
