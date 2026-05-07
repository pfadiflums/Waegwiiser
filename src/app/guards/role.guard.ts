import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const requiredRoles = route.data['roles'] as string[];
  const userRoles = authService.getCurrentUserRoles();

  if (!userRoles.length) {
    router.navigate(['/login']);
    return false;
  }

  if (requiredRoles && !requiredRoles.some(r => userRoles.includes(r))) {
    router.navigate(['/']);
    return false;
  }

  return true;
};
