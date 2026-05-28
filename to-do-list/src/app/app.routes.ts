import { Routes } from '@angular/router';

import { guestGuard } from './auth/guest-guard';
import { Home } from './pages/home/home';


export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', canActivate: [guestGuard], loadComponent: () => import('./auth/login/login').then(m => m.LoginComponent) },
  { path: 'register', canActivate: [guestGuard], loadComponent: () => import('./auth/register/register').then(m => m.RegisterComponent) },

  {
    path: 'in-progress',
    loadComponent: () => import('./pages/in-progress/in-progress').then(m => m.InProgress)
  },
  {
    path: 'completed',
    loadComponent: () => import('./pages/completed/completed').then(m => m.Completed)
  }
];