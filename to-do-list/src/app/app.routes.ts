import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { InProgress } from './pages/in-progress/in-progress';
import { Completed } from './pages/completed/completed';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'in-progress', component: InProgress },
  { path: 'completed', component: Completed },
  { path: '', redirectTo: 'in-progress', pathMatch: 'full' }
];