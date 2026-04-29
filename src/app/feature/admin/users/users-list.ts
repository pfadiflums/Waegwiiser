import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Search, ShieldCheck, Trash2, UserRound } from 'lucide-angular';
import { UserService } from '../../../services/user.service';
import { UserResponse } from '../../../models/auth.model';

const ROLES = ['ADMIN', 'ABTEILUNGSLEITER', 'STUFENLEITER', 'LEITER', 'MEMBER'];

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="admin-page">

      <!-- Lookup -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">
            <lucide-icon [img]="Search" [size]="18"></lucide-icon>
            Benutzer suchen
          </div>
          <p class="card-subtitle">Benutzer-ID eingeben um ein Konto zu verwalten</p>
        </div>
        <div class="card-body">
          <form class="search-form" (ngSubmit)="lookup()">
            <input
              type="text"
              [(ngModel)]="searchId"
              name="searchId"
              placeholder="Benutzer-ID (UUID)"
              class="search-input"
            >
            <button type="submit" class="btn-primary" [disabled]="searching() || !searchId.trim()">
              <lucide-icon [img]="Search" [size]="16"></lucide-icon>
              {{ searching() ? 'Suchen...' : 'Suchen' }}
            </button>
          </form>
          @if (lookupError()) {
            <p class="error-text">{{ lookupError() }}</p>
          }
        </div>
      </div>

      <!-- Result -->
      @if (foundUser(); as u) {
        <div class="card">
          <div class="card-header">
            <div class="card-title">
              <lucide-icon [img]="UserRound" [size]="18"></lucide-icon>
              {{ u.firstName }} {{ u.lastName }}
            </div>
          </div>
          <div class="card-body">
            <div class="user-meta">
              <div class="meta-row">
                <span class="meta-label">ID</span>
                <span class="meta-value mono">{{ u.id }}</span>
              </div>
              <div class="meta-row">
                <span class="meta-label">E-Mail</span>
                <span class="meta-value">{{ u.email }}</span>
              </div>
              <div class="meta-row">
                <span class="meta-label">Benutzername</span>
                <span class="meta-value">{{ u.username }}</span>
              </div>
              <div class="meta-row">
                <span class="meta-label">Rolle</span>
                <span class="role-badge">{{ u.role }}</span>
              </div>
              <div class="meta-row">
                <span class="meta-label">E-Mail bestätigt</span>
                <span class="meta-value">{{ u.emailVerified ? 'Ja' : 'Nein' }}</span>
              </div>
            </div>

            <div class="actions-row">
              <div class="role-select-group">
                <lucide-icon [img]="ShieldCheck" [size]="16"></lucide-icon>
                <select [(ngModel)]="selectedRole" class="role-select">
                  @for (role of roles; track role) {
                    <option [value]="role">{{ role }}</option>
                  }
                </select>
                <button class="btn-primary" (click)="updateRole(u.id)" [disabled]="savingRole()">
                  {{ savingRole() ? 'Speichern...' : 'Rolle setzen' }}
                </button>
              </div>

              <button class="btn-danger" (click)="deleteUser(u.id)" [disabled]="deleting()">
                <lucide-icon [img]="Trash2" [size]="16"></lucide-icon>
                {{ deleting() ? 'Löschen...' : 'Konto löschen' }}
              </button>
            </div>

            @if (actionMsg()) {
              <p class="feedback" [class.success]="actionSuccess()">{{ actionMsg() }}</p>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .admin-page { display: flex; flex-direction: column; gap: 1.5rem; max-width: 720px; }

    .card {
      background: white;
      border-radius: 0.75rem;
      border: 1px solid var(--admin-border);
      box-shadow: 0 1px 2px 0 rgba(0,0,0,0.05);
      overflow: hidden;
    }

    .card-header {
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid var(--admin-border);
    }

    .card-title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 600;
      font-size: 0.9375rem;
      color: var(--admin-text);
      letter-spacing: normal;
    }

    .card-subtitle {
      font-size: 0.8125rem;
      color: var(--admin-text-muted);
      margin: 0.25rem 0 0;
      letter-spacing: normal;
    }

    .card-body { padding: 1.5rem; display: flex; flex-direction: column; gap: 1.25rem; }

    .search-form {
      display: flex;
      gap: 0.75rem;
    }

    .search-input {
      flex: 1;
      padding: 0.5rem 0.75rem;
      border: 1px solid var(--admin-border);
      border-radius: 0.375rem;
      font-size: 0.875rem;
      font-family: inherit;
      color: var(--admin-text);
      outline: none;

      &:focus { border-color: var(--admin-primary); }
    }

    .btn-primary {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      padding: 0.5rem 1.25rem;
      background: var(--admin-primary);
      color: white;
      border: none;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      font-weight: 500;
      font-family: inherit;
      cursor: pointer;
      white-space: nowrap;
      transition: background 0.2s;

      &:hover:not(:disabled) { background: #4f46e5; }
      &:disabled { opacity: 0.6; cursor: not-allowed; }
    }

    .error-text { font-size: 0.8125rem; color: #ef4444; margin: 0; letter-spacing: normal; }

    .user-meta { display: flex; flex-direction: column; gap: 0.75rem; }

    .meta-row { display: flex; align-items: center; gap: 1rem; font-size: 0.875rem; }
    .meta-label { color: var(--admin-text-muted); width: 140px; flex-shrink: 0; }
    .meta-value { color: var(--admin-text); font-weight: 500; }
    .mono { font-family: monospace; font-size: 0.8125rem; }

    .role-badge {
      background: #e0e7ff;
      color: #4338ca;
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0.2rem 0.6rem;
      border-radius: 9999px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .actions-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 0.75rem;
      padding-top: 0.75rem;
      border-top: 1px solid var(--admin-border);
    }

    .role-select-group {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--admin-text-muted);
    }

    .role-select {
      padding: 0.5rem 0.75rem;
      border: 1px solid var(--admin-border);
      border-radius: 0.375rem;
      font-size: 0.875rem;
      font-family: inherit;
      color: var(--admin-text);
      background: white;
      outline: none;
      cursor: pointer;
    }

    .btn-danger {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      padding: 0.5rem 1rem;
      background: none;
      border: 1px solid #fca5a5;
      color: #ef4444;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      font-weight: 500;
      font-family: inherit;
      cursor: pointer;
      transition: all 0.2s;

      &:hover:not(:disabled) { background: #fee2e2; }
      &:disabled { opacity: 0.6; cursor: not-allowed; }
    }

    .feedback {
      font-size: 0.8125rem;
      color: #ef4444;
      margin: 0;
      letter-spacing: normal;

      &.success { color: #059669; }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersListComponent {
  private userService = inject(UserService);

  readonly Search = Search;
  readonly ShieldCheck = ShieldCheck;
  readonly Trash2 = Trash2;
  readonly UserRound = UserRound;

  readonly roles = ROLES;

  searchId = '';
  searching = signal(false);
  lookupError = signal<string | null>(null);
  foundUser = signal<UserResponse | null>(null);

  selectedRole = '';
  savingRole = signal(false);
  deleting = signal(false);
  actionMsg = signal<string | null>(null);
  actionSuccess = signal(false);

  lookup(): void {
    this.lookupError.set(null);
    this.foundUser.set(null);
    this.actionMsg.set(null);
    this.searching.set(true);
    this.userService.getUserById(this.searchId.trim()).subscribe({
      next: (u) => {
        this.foundUser.set(u);
        this.selectedRole = u.role;
        this.searching.set(false);
      },
      error: () => {
        this.lookupError.set('Benutzer nicht gefunden.');
        this.searching.set(false);
      },
    });
  }

  updateRole(id: string): void {
    this.savingRole.set(true);
    this.actionMsg.set(null);
    this.userService.updateUserRole(id, this.selectedRole).subscribe({
      next: () => {
        const u = this.foundUser();
        if (u) this.foundUser.set({ ...u, role: this.selectedRole });
        this.actionSuccess.set(true);
        this.actionMsg.set('Rolle aktualisiert.');
        this.savingRole.set(false);
      },
      error: () => {
        this.actionSuccess.set(false);
        this.actionMsg.set('Fehler beim Aktualisieren der Rolle.');
        this.savingRole.set(false);
      },
    });
  }

  deleteUser(id: string): void {
    if (!confirm('Konto wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.')) return;
    this.deleting.set(true);
    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.foundUser.set(null);
        this.searchId = '';
        this.deleting.set(false);
      },
      error: () => {
        this.actionSuccess.set(false);
        this.actionMsg.set('Fehler beim Löschen des Kontos.');
        this.deleting.set(false);
      },
    });
  }
}
