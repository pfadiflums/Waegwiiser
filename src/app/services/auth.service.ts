import { inject, Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { User } from '../models/payload-types/collections/user';
import { Role } from '../models/payload-types/collections/role';
import { UserAuthOperations } from '../models/payload-types/common';
import { catchError, map, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = environment.apiUrl;

  private userSignal = signal<User | null>(null);
  private initialized = signal(false);

  user = this.userSignal.asReadonly();
  isInitialized = this.initialized.asReadonly();
  isAuthenticated = computed(() => !!this.userSignal());
  isAdmin = computed(() => {
    const user = this.userSignal();
    if (!user) return false;
    const role = user.role;
    if (typeof role === 'string') return role === 'admin';
    return role.slug === 'admin';
  });
  isLeader = computed(() => {
    const user = this.userSignal();
    if (!user) return false;
    const role = user.role;
    const slug = typeof role === 'string' ? role : role.slug;
    return slug === 'leader' || slug === 'admin' || slug === 'leiter';
  });

  userRole = computed(() => {
    const user = this.userSignal();
    if (!user) return '';
    const role = user.role;
    if (typeof role === 'string') return role;
    return role.name || role.slug;
  });

  constructor() {}

  private setCookie(name: string, value: string, days: number = 7) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "; expires=" + date.toUTCString();
    document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Lax";
  }

  private getCookie(name: string): string | null {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  private eraseCookie(name: string) {
    document.cookie = name + '=; Max-Age=-99999999; path=/;';
  }

  login(credentials: UserAuthOperations['login']) {
    return this.http.post<{ user: User; token: string }>(`${this.apiUrl}/api/users/login`, credentials).pipe(
      tap(({ user, token }) => {
        this.userSignal.set(user);
        this.setCookie('payload-token', token);
      }),
      map(({ user }) => user)
    );
  }

  forgotPassword(email: string) {
    return this.http.post(`${this.apiUrl}/api/users/forgot-password`, { email });
  }

  resetPassword(data: UserAuthOperations['forgotPassword'] & { token: string }) {
    return this.http.post(`${this.apiUrl}/api/users/reset-password`, data);
  }

  verifyEmail(token: string) {
    return this.http.post(`${this.apiUrl}/api/users/verify`, { token });
  }

  inviteUser(email: string) {
    return this.http.post(`${this.apiUrl}/api/invites`, { email });
  }

  validateInviteToken(token: string) {
    const now = new Date().toISOString();
    return this.http.get<{ docs: any[] }>(
      `${this.apiUrl}/api/invites?where[token][equals]=${token}&where[used][equals]=false&where[expiresAt][greater_than]=${now}`
    );
  }

  register(data: any) {
    return this.http.post<any>(`${this.apiUrl}/api/users`, data).pipe(
      tap((res) => {
        if (res && res.user && res.token) {
          this.userSignal.set(res.user);
          this.setCookie('payload-token', res.token);
        }
      }),
      map((res) => (res && res.user ? res.user : res))
    );
  }

  logout() {
    return this.http.post(`${this.apiUrl}/api/users/logout`, {}).pipe(
      tap(() => {
        this.userSignal.set(null);
        this.eraseCookie('payload-token');
        this.router.navigate(['/']);
      }),
      catchError(() => {
        // Even if logout fails on server, clear local state
        this.userSignal.set(null);
        this.eraseCookie('payload-token');
        this.router.navigate(['/']);
        return of(null);
      })
    );
  }

  me() {
    const token = this.getCookie('payload-token');
    if (!token) {
      this.initialized.set(true);
      return of(null);
    }

    return this.http.get<{ user: User }>(`${this.apiUrl}/api/users/me`).pipe(
      tap(({ user }) => {
        if (user) {
          this.userSignal.set(user);
        } else {
          this.eraseCookie('payload-token');
          this.userSignal.set(null);
        }
        this.initialized.set(true);
      }),
      map(({ user }) => user),
      catchError(() => {
        this.eraseCookie('payload-token');
        this.userSignal.set(null);
        this.initialized.set(true);
        return of(null);
      })
    );
  }

  getToken(): string | null {
    return this.getCookie('payload-token');
  }

  setToken(token: string) {
    this.setCookie('payload-token', token);
  }

  getApiUrl(): string {
    return this.apiUrl;
  }

  clearSession() {
    this.userSignal.set(null);
    this.eraseCookie('payload-token');
    this.router.navigate(['/login']);
  }

  update(data: Partial<User>): Observable<User | null> {
    const userId = this.userSignal()?.id;
    if (!userId) return of(null);

    return this.http.patch<User>(`${this.apiUrl}/api/users/${userId}`, data).pipe(
      tap((user) => {
        if (user) {
          this.userSignal.set(user);
        }
      })
    );
  }
}
