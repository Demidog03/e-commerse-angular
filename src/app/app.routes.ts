import { Routes } from '@angular/router';
import { LoginPage } from './pages/login-page/login-page';
import { HomePage } from './pages/home-page/home-page';
import { authGuard, guestGuard } from '../core/auth/auth.guard';
import { NotFoundPage } from './pages/not-found-page/not-found-page';
import { RegisterPage } from './pages/register-page/register-page';
import { ProductsPage } from './pages/products/products-page/products-page';
import { MainLayout } from './layout/main-layout/main-layout';
import { ProductsDetailsPage } from './pages/products/products-details-page/products-details-page';
import { RouterOutletShell } from './layout/router-outlet-shell/router-outlet-shell';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: 'products',
        component: RouterOutletShell,
        canActivate: [authGuard],
        children: [
          {
            path: '',
            component: ProductsPage,
          },
          {
            path: ':id',
            component: ProductsDetailsPage,
          },
        ],
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
