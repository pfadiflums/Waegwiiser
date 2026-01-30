import { inject, Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { User } from '../models/payload-types/collections/user';
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
  isAdmin = computed(() => this.userSignal()?.role === 'admin');
  isLeader = computed(() => this.userSignal()?.role === 'leader' || this.userSignal()?.role === 'admin');

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
