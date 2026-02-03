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
        path: 'users',
        canActivate: [adminGuard],
        children: [
          {
            path: '',
            loadComponent: () => import('./feature/admin/users/user-list/user-list').then(m => m.UserListComponent),
          },
          {
            path: 'new',
            loadComponent: () => import('./feature/admin/users/user-form/user-form').then(m => m.UserFormComponent),
          },
          {
            path: 'edit/:id',
            loadComponent: () => import('./feature/admin/users/user-form/user-form').then(m => m.UserFormComponent),
          }
        ]
      },
      {
        path: 'downloads',
        canActivate: [adminGuard],
        children: [
          {
            path: '',
            loadComponent: () => import('./feature/admin/downloads/downloads-list/downloads-list').then(m => m.DownloadsListComponent),
          },
          {
            path: 'new',
            loadComponent: () => import('./feature/admin/downloads/downloads-form/downloads-form').then(m => m.DownloadsFormComponent),
          },
          {
            path: 'edit/:id',
            loadComponent: () => import('./feature/admin/downloads/downloads-form/downloads-form').then(m => m.DownloadsFormComponent),
          }
        ]
      }
    ]
  },

  { path: 'auth', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: '' }
];
