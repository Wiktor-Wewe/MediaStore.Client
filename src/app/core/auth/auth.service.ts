import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../api/api.config';
import { LoginRequest, LoginResponse, RegisterRequest, JwtPayload } from './auth.models';
import { tap } from 'rxjs';

const TOKEN_KEY = 'media_store_access_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenSignal = signal<string | null>(localStorage.getItem(TOKEN_KEY));

  readonly token = computed(() => this.tokenSignal());
  readonly isAuthenticated = computed(
    () => !!this.tokenSignal() && !this.isTokenExpired(this.tokenSignal())
  );
  readonly currentUser = computed(() => this.decodeToken(this.tokenSignal()));
  readonly isAdmin = computed(() => {
    const user = this.currentUser();

    return (
      user?.role === 'Admin' ||
      user?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] === 'Admin'
    );
  });
  constructor(private readonly http: HttpClient) {}

  login(request: LoginRequest) {
    return this.http.post<LoginResponse>(`${API_BASE_URL}/auth/login`, request).pipe(
      tap((response) => {
        localStorage.setItem(TOKEN_KEY, response.accessToken);
        this.tokenSignal.set(response.accessToken);
      })
    );
  }

  register(request: RegisterRequest) {
    return this.http.post<void>(`${API_BASE_URL}/auth/register`, request);
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    this.tokenSignal.set(null);
  }

  getAccessToken(): string | null {
    return this.tokenSignal();
  }

  private decodeToken(token: string | null): JwtPayload | null {
    if (!token) return null;

    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decoded) as JwtPayload;
    } catch {
      return null;
    }
  }

  private isTokenExpired(token: string | null): boolean {
    const payload = this.decodeToken(token);

    if (!payload?.exp) return true;

    return payload.exp * 1000 < Date.now();
  }
}
