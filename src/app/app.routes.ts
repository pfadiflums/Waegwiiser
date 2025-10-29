import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./feature/home/home').then(m => m.Home),
  },
  {
    path: 'stufe/:stufe',
    loadComponent: () => import('./feature/stufe/stufe').then(m => m.Stufe),
  },
];
