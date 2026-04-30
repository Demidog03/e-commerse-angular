import { Routes } from '@angular/router';
import { LoginPage } from './pages/login-page/login-page';
import { HomePage } from './pages/home-page/home-page';
import { authGuard, guestGuard } from '../core/auth/auth.guard';
import { NotFoundPage } from './pages/not-found-page/not-found-page';
import { RegisterPage } from './pages/register-page/register-page';

export const routes: Routes = [{
    path: 'home',
    component: HomePage,
    canActivate: [authGuard]
}, {
    path: 'login',
    component: LoginPage,
    canActivate: [guestGuard]
},
{
    path: 'register',
    component: RegisterPage,
    canActivate: [guestGuard]
},
{
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
}, {
    path: '**',
    component: NotFoundPage
}];
