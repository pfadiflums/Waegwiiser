import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, switchMap } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthResponse, LoginRequest, UserResponse } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  private tokenKey = 'jwt_token';
  private userRoleKey = 'user_role';

  login(credentials: LoginRequest): Observable<UserResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap(response => {
        localStorage.setItem(this.tokenKey, response.token);
      }),
      switchMap(() => this.getCurrentUser()),
      tap(user => {
        localStorage.setItem(this.userRoleKey, JSON.stringify(user.roles));
      })
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/auth/logout`, {}).pipe(
      tap(() => {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.userRoleKey);
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getCurrentUserRoles(): string[] {
    const stored = localStorage.getItem(this.userRoleKey);
    if (!stored) return [];
    try { return JSON.parse(stored); } catch { return []; }
  }

  getCurrentUserRole(): string | null {
    const roles = this.getCurrentUserRoles();
    return roles.length > 0 ? roles[0] : null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.apiUrl}/users/me`);
  }

}
