import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'admin',
    loadComponent: () => import('./layout/admin-layout/admin-layout').then((m) => m.AdminLayout),
    children: [
      {
        path: '',
        canActivate: [authGuard],
        loadComponent: () => import('./layout/admin-shell/admin-shell').then((m) => m.AdminShell),
        children: [
          {
            path: '',
            loadComponent: () => import('./feature/admin/dashboard/dashboard').then((m) => m.DashboardComponent),
            data: { title: 'Dashboard' },
          },
          {
            path: 'stufen',
            loadComponent: () => import('./feature/admin/stufen/stufen').then((m) => m.StufenComponent),
            data: { title: 'Stufen' },
          },
          {
            path: 'uebungen',
            loadComponent: () => import('./feature/admin/uebungen/uebungen').then((m) => m.UebungenComponent),
            data: { title: 'Übungen' },
          },
          {
            path: 'fotos',
            loadComponent: () => import('./feature/admin/fotos/fotos').then((m) => m.FotosComponent),
            data: { title: 'Fotos' },
          },
        ],
      },
      {
        path: 'login',
        canActivate: [guestGuard],
        loadComponent: () => import('./feature/admin/login/login').then((m) => m.LoginComponent),
      },
    ],
  },
  {
    path: 'auth/callback',
    loadComponent: () =>
      import('./feature/admin/oauth2-redirect/oauth2-redirect').then(
        (m) => m.OAuth2RedirectComponent,
      ),
  },
  {
    path: '',
    loadComponent: () => import('./layout/public-layout/public-layout').then((m) => m.PublicLayout),
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        loadComponent: () => import('./feature/public/home/home').then((m) => m.Home),
      },
      {
        path: 'stufe/:slug',
        loadComponent: () =>
          import('./feature/public/stufe-detail/stufe-detail').then((m) => m.StufeDetailComponent),
      },
      {
        path: 'join',
        loadComponent: () => import('./feature/public/join/join').then((m) => m.JoinComponent),
      },
      {
        path: 'about',
        loadComponent: () => import('./feature/public/about/about').then((m) => m.AboutComponent),
      },
      {
        path: 'downloads',
        loadComponent: () =>
          import('./feature/public/downloads/downloads').then((m) => m.DownloadsComponent),
      },
      {
        path: 'photos',
        loadComponent: () => import('./feature/public/photos/photos').then((m) => m.PhotosComponent),
      },
      {
        path: 'shop',
        loadComponent: () => import('./feature/public/shop/shop').then((m) => m.ShopComponent),
      },
      {
        path: 'pfadihaus',
        loadComponent: () =>
          import('./feature/public/pfadihaus/pfadihaus').then((m) => m.PfadihausComponent),
      },
      {
        path: 'impressum',
        loadComponent: () =>
          import('./feature/public/impressum/impressum').then((m) => m.ImpressumComponent),
      },
      {
        path: 'datenschutz',
        loadComponent: () =>
          import('./feature/public/datenschutz/datenschutz').then((m) => m.DatenschutzComponent),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
