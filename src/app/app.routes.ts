import { Routes } from '@angular/router';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/public-layout/public-layout').then(m => m.PublicLayoutComponent),
    children: [
      {
        path: '', redirectTo: 'home', pathMatch: 'full'
      },
      {
        path: 'home',
        loadComponent: () => import('./feature/home/home').then(m => m.Home),
      },
      {
        path: 'stufe/:slug',
        loadComponent: () => import('./feature/stufe-detail/stufe-detail').then(m => m.StufeDetailComponent),
      },
      {
        path: 'join',
        loadComponent: () => import('./feature/join/join').then(m => m.JoinComponent),
      },
      {
        path: 'about',
        loadComponent: () => import('./feature/about/about').then(m => m.AboutComponent),
      },
      {
        path: 'downloads',
        loadComponent: () => import('./feature/downloads/downloads').then(m => m.DownloadsComponent),
      },
      {
        path: 'photos',
        loadComponent: () => import('./feature/photos/photos').then(m => m.PhotosComponent),
      },
      {
        path: 'shop',
        loadComponent: () => import('./feature/shop/shop').then(m => m.ShopComponent),
      },
      {
        path: 'pfadihaus',
        loadComponent: () => import('./feature/pfadihaus/pfadihaus').then(m => m.PfadihausComponent),
      }
    ]
  },
  {
    path: 'login',
    loadComponent: () => import('./feature/auth/login/login').then(m => m.LoginComponent),
  },
  {
    path: 'oauth2/redirect',
    loadComponent: () => import('./feature/auth/oauth2-redirect/oauth2-redirect').then(m => m.OAuth2RedirectComponent),
  },
  {
    path: 'admin',
    loadComponent: () => import('./layout/admin-layout/admin-layout').then(m => m.AdminLayoutComponent),
    canActivate: [roleGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./feature/admin/dashboard/dashboard').then(m => m.DashboardComponent),
      },
      {
        path: 'stufen',
        loadComponent: () => import('./feature/admin/stufen/stufen-list').then(m => m.StufenListComponent),
        data: { roles: ['ADMIN', 'ABTEILUNGSLEITER'] }
      },
      {
        path: 'stufen/new',
        loadComponent: () => import('./feature/admin/stufen/stufe-edit').then(m => m.StufeEditComponent),
        data: { roles: ['ADMIN', 'ABTEILUNGSLEITER'] }
      },
      {
        path: 'stufen/edit/:id',
        loadComponent: () => import('./feature/admin/stufen/stufe-edit').then(m => m.StufeEditComponent),
        data: { roles: ['ADMIN', 'ABTEILUNGSLEITER'] }
      },
      {
        path: 'uebungen',
        loadComponent: () => import('./feature/admin/uebungen/uebungen-list').then(m => m.UebungenListComponent),
        data: { roles: ['ADMIN', 'STUFENLEITER', 'ABTEILUNGSLEITER'] }
      },
      {
        path: 'uebungen/new',
        loadComponent: () => import('./feature/admin/uebungen/uebung-edit').then(m => m.UebungEditComponent),
        data: { roles: ['ADMIN', 'STUFENLEITER', 'ABTEILUNGSLEITER'] }
      },
      {
        path: 'uebungen/edit/:id',
        loadComponent: () => import('./feature/admin/uebungen/uebung-edit').then(m => m.UebungEditComponent),
        data: { roles: ['ADMIN', 'STUFENLEITER', 'ABTEILUNGSLEITER'] }
      },

      {
        path: 'media',
        loadComponent: () => import('./feature/admin/media/media-list').then(m => m.MediaListComponent),
        data: { roles: ['ADMIN', 'LEITER', 'STUFENLEITER', 'ABTEILUNGSLEITER'] }
      },
      {
        path: 'users',
        loadComponent: () => import('./feature/admin/users/users-list').then(m => m.UsersListComponent),
        data: { roles: ['ADMIN', 'ABTEILUNGSLEITER'] }
      },
      {
        path: 'account',
        loadComponent: () => import('./feature/admin/account/account').then(m => m.AccountComponent),
      },
    ]
  },
  { path: '**', redirectTo: '' }
];
