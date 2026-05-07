import { Routes } from '@angular/router';
import { LoginPage } from './pages/login-page/login-page';
import { HomePage } from './pages/home-page/home-page';
import { authGuard, guestGuard } from '../core/auth/auth.guard';
import { NotFoundPage } from './pages/not-found-page/not-found-page';
import { RegisterPage } from './pages/register-page/register-page';
import { ProductsPage } from './pages/products-page/products-page';
import { MainLayout } from './layout/main-layout/main-layout';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: 'products',
        component: ProductsPage,
        canActivate: [authGuard],
      },
      {
        path: 'home',
        component: HomePage,
        canActivate: [authGuard],
      },
      {
        path: 'login',
        component: LoginPage,
        canActivate: [guestGuard],
      },
      {
        path: 'register',
        component: RegisterPage,
        canActivate: [guestGuard],
      },
      {
        path: '',
        redirectTo: 'products',
        pathMatch: 'full',
      },
      {
        path: '**',
        component: NotFoundPage,
      },
    ],
  },
];
