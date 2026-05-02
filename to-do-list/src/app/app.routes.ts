import { Routes } from '@angular/router';
// import { Login } from './pages/login/login';
// import { Register } from './pages/register/register';  // no longer in use
import { InProgress } from './pages/in-progress/in-progress';
import { Completed } from './pages/completed/completed';

import { LoginComponent } from './auth/login/login';
import { RegisterComponent } from './auth/register/register';
import { authGuard } from './auth/auth-guard'

import { guestGuard } from './auth/guest-guard';
import { Home } from './pages/home/home';


// export const routes: Routes = [
//   { path: 'login', component: LoginComponent },
//   { path: 'register', component: RegisterComponent },
//   { path: 'in-progress', component: InProgress },
//   { path: 'completed', component: Completed },
//   { path: '', redirectTo: 'in-progress', pathMatch: 'full' }
// ];

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