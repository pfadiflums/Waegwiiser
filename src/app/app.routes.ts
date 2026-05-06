import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'admin',
    loadComponent: () => import('./layout/admin-layout/admin-layout').then(m => m.AdminLayout),
    children: [
    ]
  },
  {
    path: '',
    loadComponent: () => import('./layout/public-layout/public-layout').then(m => m.PublicLayout),
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
      },
      {
        path: 'impressum',
        loadComponent: () => import('./feature/impressum/impressum').then(m => m.ImpressumComponent),
      },
      {
        path: 'datenschutz',
        loadComponent: () => import('./feature/datenschutz/datenschutz').then(m => m.DatenschutzComponent),
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
  { path: '**', redirectTo: '' }
];
