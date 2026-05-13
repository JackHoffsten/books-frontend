import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LoginCredentials, RegisterCredentials, AuthResponse } from '../models/user.model';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = 'https://books.jackhoffsten.se/api/auth';
  private readonly tokenKey = 'authToken';
  private readonly http: HttpClient = inject(HttpClient);

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => this.setToken(response.token))
    );
  }

  register(credentials: RegisterCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, credentials).pipe(
      tap(response => this.setToken(response.token))
    );
  }

  setToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
  }
}
