import { Routes } from '@angular/router';
import { ProductListPageComponent } from './features/products/pages/product-list-page/product-list-page.component';
import { LoginPageComponent } from './features/auth/login-page/login-page.component';
import { RegisterPageComponent } from './features/auth/register-page/register-page.component';
import { adminGuard } from './core/auth/admin.guard';
import { guestGuard } from './core/auth/guest.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'products',
  },
  {
    path: 'products',
    component: ProductListPageComponent,
  },
  {
    path: 'products/:id',
    loadComponent: () =>
      import('./features/products/pages/product-details-page/product-details-page.component').then(
        (m) => m.ProductDetailsPageComponent
      ),
  },
  {
    path: 'login',
    component: LoginPageComponent,
    canActivate: [guestGuard],
  },
  {
    path: 'register',
    component: RegisterPageComponent,
    canActivate: [guestGuard],
  },
  {
    path: 'admin/users',
    loadComponent: () =>
      import('./features/admin/users-page/users-page.component').then((m) => m.UsersPageComponent),
    canActivate: [adminGuard],
  },
  {
    path: '**',
    redirectTo: 'products',
  },
];
