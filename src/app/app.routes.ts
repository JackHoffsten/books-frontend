import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { BookListComponent } from './books/book-list/book-list.component';
import { BookFormComponent } from './books/book-form/book-form.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { redirectIfAuthGuard } from './guards/redirect-if-auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'books', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [redirectIfAuthGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [redirectIfAuthGuard] },
  { path: 'books', component: BookListComponent, canActivate: [authGuard] },
  { path: 'books/new', component: BookFormComponent, canActivate: [authGuard] },
  { path: 'books/:id', component: BookFormComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'books' },
];
