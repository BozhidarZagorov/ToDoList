import { Routes } from '@angular/router';
// import { Login } from './pages/login/login';
// import { Register } from './pages/register/register';  // no longer in use
import { InProgress } from './pages/in-progress/in-progress';
import { Completed } from './pages/completed/completed';

import { LoginComponent } from './auth/login/login';
import { RegisterComponent } from './auth/register/register';


export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'in-progress', component: InProgress },
  { path: 'completed', component: Completed },
  { path: '', redirectTo: 'in-progress', pathMatch: 'full' }
];