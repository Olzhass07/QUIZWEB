import { Routes } from '@angular/router';
import { Signup } from './modules/auth/signup/signup';
import { Login } from './modules/auth/login/login';

export const routes: Routes = [
    {path: 'register', component: Signup},
    {path: 'login', component: Login}
];
