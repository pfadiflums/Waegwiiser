import { inject, Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { User } from '../models/payload-types/collections/user';
import { UserAuthOperations } from '../models/payload-types/common';
import { catchError, map, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = environment.apiUrl;

  private userSignal = signal<User | null>(null);

  user = this.userSignal.asReadonly();
  isAuthenticated = computed(() => !!this.userSignal());
  isAdmin = computed(() => this.userSignal()?.role === 'admin');
  isLeader = computed(() => this.userSignal()?.role === 'leader' || this.userSignal()?.role === 'admin');

  constructor() {
    this.me().subscribe();
  }

  login(credentials: UserAuthOperations['login']) {
    return this.http.post<{ user: User; token: string }>(`${this.apiUrl}/api/users/login`, credentials).pipe(
      tap(({ user, token }) => {
        this.userSignal.set(user);
        localStorage.setItem('payload-token', token);
      }),
      map(({ user }) => user)
    );
  }

  logout() {
    return this.http.post(`${this.apiUrl}/api/users/logout`, {}).pipe(
      tap(() => {
        this.userSignal.set(null);
        localStorage.removeItem('payload-token');
        this.router.navigate(['/login']);
      }),
      catchError(() => {
        // Even if logout fails on server, clear local state
        this.userSignal.set(null);
        localStorage.removeItem('payload-token');
        this.router.navigate(['/login']);
        return of(null);
      })
    );
  }

  me() {
    const token = localStorage.getItem('payload-token');
    if (!token) {
      return of(null);
    }

    return this.http.get<{ user: User }>(`${this.apiUrl}/api/users/me`).pipe(
      tap(({ user }) => {
        if (user) {
          this.userSignal.set(user);
        } else {
          this.logout().subscribe();
        }
      }),
      map(({ user }) => user),
      catchError(() => {
        this.logout().subscribe();
        return of(null);
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem('payload-token');
  }

  clearSession() {
    this.userSignal.set(null);
    localStorage.removeItem('payload-token');
    this.router.navigate(['/login']);
  }
}
