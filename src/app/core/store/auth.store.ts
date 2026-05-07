import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { switchMap, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { LoginRequest, UserResponse } from '../models/auth.model';

interface AuthState {
  token: string | null;
  user: UserResponse | null;
  isLoading: boolean;
  error: string | null;
}

const TOKEN_KEY = 'jwt_token' as const;
const USER_KEY = 'auth_user' as const;

function loadStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

function loadStoredUser(): UserResponse | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as UserResponse;
  } catch {
    return null;
  }
}

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  private readonly _state = signal<AuthState>({
    token: loadStoredToken(),
    user: loadStoredUser(),
    isLoading: false,
    error: null,
  });

  readonly isAuthenticated = computed(() => !!this._state().token);
  readonly isLoading = computed(() => this._state().isLoading);
  readonly error = computed(() => this._state().error);
  readonly user = computed(() => this._state().user);
  readonly roles = computed(() => this._state().user?.roles ?? []);

  getToken(): string | null {
    return this._state().token;
  }

  hasAnyRole(roles: string[]): boolean {
    return roles.some(r => this.roles().includes(r));
  }

  login(credentials: LoginRequest): void {
    this._state.update(s => ({ ...s, isLoading: true, error: null }));

    this.authService.login(credentials).pipe(
      tap(response => {
        localStorage.setItem(TOKEN_KEY, response.token);
        this._state.update(s => ({ ...s, token: response.token }));
      }),
      switchMap(() => this.authService.fetchCurrentUser()),
    ).subscribe({
      next: user => {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        this._state.update(s => ({ ...s, user, isLoading: false }));
        this.router.navigate(['/admin']);
      },
      error: (err: HttpErrorResponse) => {
        const message = (err.error as { message?: string })?.message ?? 'Login fehlgeschlagen';
        this._state.update(s => ({ ...s, isLoading: false, error: message }));
      },
    });
  }

  logout(): void {
    this.authService.logout().subscribe({
      complete: () => this.clearSession(),
      error: () => this.clearSession(),
    });
  }

  initFromOAuth(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
    this._state.update(s => ({ ...s, token, isLoading: true }));

    this.authService.fetchCurrentUser().subscribe({
      next: user => {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        this._state.update(s => ({ ...s, user, isLoading: false }));
        this.router.navigate(['/admin']);
      },
      error: () => {
        this.clearSession();
        this.router.navigate(['/admin/login'], { queryParams: { error: 'auth_failed' } });
      },
    });
  }

  handleUnauthorized(): void {
    this.clearSession();
    this.router.navigate(['/admin/login']);
  }

  clearError(): void {
    this._state.update(s => ({ ...s, error: null }));
  }

  clearSession(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this._state.set({ token: null, user: null, isLoading: false, error: null });
  }
}
