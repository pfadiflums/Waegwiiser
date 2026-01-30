import { Routes } from '@angular/router';
import { authGuard, adminGuard, leaderGuard } from './guards/auth.guard';

export const routes: Routes = [
  // Public Layout
  {
    path: '',
    loadComponent: () => import('./layout/public-layout/public-layout').then(m => m.PublicLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./feature/home/home').then(m => m.Home),
      },
      // Add more public routes here
    ]
  },

  // Login View (Centered, no layout)
  {
    path: 'login',
    loadComponent: () => import('./feature/auth/login/login').then(m => m.Login)
  },

  // Admin Layout
  {
    path: 'admin',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/admin-layout/admin-layout').then(m => m.AdminLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./feature/admin/dashboard/dashboard').then(m => m.Dashboard),
      },
      {
        path: 'uebungen',
        canActivate: [leaderGuard],
        loadComponent: () => import('./feature/home/home').then(m => m.Home), // Placeholder
      },
      {
        path: 'leitende',
        canActivate: [adminGuard],
        loadComponent: () => import('./feature/home/home').then(m => m.Home), // Placeholder
      },
      {
        path: 'downloads',
        canActivate: [adminGuard],
        loadComponent: () => import('./feature/home/home').then(m => m.Home), // Placeholder
      }
    ]
  },

  // Fallback
  { path: 'auth', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: '' }
];
