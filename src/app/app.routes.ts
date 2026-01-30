import { Routes } from '@angular/router';
import { authGuard, adminGuard, leaderGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/public-layout/public-layout').then(m => m.PublicLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./feature/home/home').then(m => m.Home),
      },
      {
        path: 'stufe/:slug',
        loadComponent: () => import('./feature/stufe-detail/stufe-detail').then(m => m.StufeDetailComponent),
      },
    ]
  },

  {
    path: 'login',
    loadComponent: () => import('./feature/auth/login/login').then(m => m.Login)
  },

  {
    path: 'login-success',
    loadComponent: () => import('./feature/auth/login-success/login-success').then(m => m.LoginSuccessComponent)
  },
  {
    path: 'login-error',
    loadComponent: () => import('./feature/auth/login-error/login-error').then(m => m.LoginErrorComponent)
  },

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
        children: [
          {
            path: '',
            loadComponent: () => import('./feature/admin/uebungen/uebungen-list/uebungen-list').then(m => m.UebungenListComponent),
          },
          {
            path: 'new',
            loadComponent: () => import('./feature/admin/uebungen/uebungen-form/uebungen-form').then(m => m.UebungenFormComponent),
          },
          {
            path: 'edit/:id',
            loadComponent: () => import('./feature/admin/uebungen/uebungen-form/uebungen-form').then(m => m.UebungenFormComponent),
          }
        ]
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

  { path: 'auth', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: '' }
];
