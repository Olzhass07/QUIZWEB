import { Routes } from '@angular/router';
import { Signup } from './modules/auth/signup/signup';
import { Login } from './modules/auth/login/login';

export const routes: Routes = [
  { path: 'register', component: Signup },
  { path: 'login', component: Login },
  { path: 'user', loadChildren: () => import('./modules/user/user-module').then(m => m.UserModule) },
  { path: 'admin', loadChildren: () => import('./modules/admin/admin-module').then(m => m.AdminModule) },
];
