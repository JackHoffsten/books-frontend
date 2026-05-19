import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LoginCredentials, RegisterCredentials, AuthResponse, User } from '../models/user.model';
import { Observable, tap } from 'rxjs';
import { CookieService } from './cookie.service';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiService: ApiService = inject(ApiService);
  private readonly http: HttpClient = inject(HttpClient);
  private readonly cookieService: CookieService = inject(CookieService);

  private readonly API_URL = this.apiService.getUrl('/auth');
  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly USERNAME_KEY = 'username';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';

  public currentUser: User | null = null;

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials).pipe(
      tap((response) => {
        this.setAccessToken(response.accessToken);
        this.setUser(response.username, response.email);
      })
    );
  }

  register(credentials: RegisterCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/register`, credentials).pipe(
      tap((response) => {
        this.setAccessToken(response.accessToken);
        this.setUser(response.username, response.email);
      })
    );
  }

  refreshToken(): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/refresh-token`, {}).pipe(
      tap(response => this.setAccessToken(response.accessToken))
    );
  }

  private setAccessToken(accessToken: string) {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
  }

  private setUser(username: string, email: string) {
    this.currentUser = { username: username, email: email };
    localStorage.setItem(this.USERNAME_KEY, username);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  getUsername(): string | null {
    return localStorage.getItem(this.USERNAME_KEY);
  }

  getRefreshToken(): string | null {
    return this.cookieService.getCookie(this.REFRESH_TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  logout() {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.USERNAME_KEY);
    this.cookieService.deleteCookie(this.REFRESH_TOKEN_KEY);
    this.currentUser = null;
  }
}
