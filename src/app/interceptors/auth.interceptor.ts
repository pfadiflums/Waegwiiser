import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();
  const isApiRequest = req.url.includes('/api/');

  let authReq = req;
  if (token && isApiRequest) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `JWT ${token}`
      }
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if ((error.status === 401 || error.status === 403) && isApiRequest) {
        authService.clearSession();
      }
      return throwError(() => error);
    })
  );
};
