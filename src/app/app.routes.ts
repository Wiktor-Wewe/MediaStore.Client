import { Routes } from '@angular/router';
import { ProductListPageComponent } from './features/products/pages/product-list-page/product-list-page.component';
import { LoginPageComponent } from './features/auth/login-page/login-page.component';

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
    path: 'login',
    component: LoginPageComponent,
  },
  //{
  //  path: 'register',
  //  component: RegisterPageComponent
  //},
  //{
  //  path: 'admin/users',
  //  component: UsersPageComponent,
  //  canActivate: [adminGuard]
  //},
  {
    path: '**',
    redirectTo: 'products',
  },
];
