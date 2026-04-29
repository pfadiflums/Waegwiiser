import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, UserPlus, ShieldCheck, Trash2, X, Check, Users } from 'lucide-angular';
import { UserService } from '../../../services/user.service';
import { UserResponse, RegisterRequest } from '../../../models/auth.model';

const ROLES = ['ADMIN', 'ABTEILUNGSLEITER', 'STUFENLEITER', 'LEITER', 'MEMBER'];

const ROLE_STYLES: Record<string, string> = {
  ADMIN:            'background:#fee2e2;color:#b91c1c',
  ABTEILUNGSLEITER: 'background:#fef3c7;color:#b45309',
  STUFENLEITER:     'background:#e0e7ff;color:#4338ca',
  LEITER:           'background:#dcfce7;color:#15803d',
  MEMBER:           'background:#f3f4f6;color:#374151',
};

interface UserRow extends UserResponse {
  pendingRole: string;
  saving: boolean;
}

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="admin-page">

      <!-- Create panel -->
      @if (showCreate()) {
        <div class="create-panel">
          <div class="panel-header">
            <span class="panel-title">
              <lucide-icon [img]="UserPlus" [size]="18"></lucide-icon>
              Neuer Benutzer
            </span>
            <button class="icon-btn" (click)="showCreate.set(false)">
              <lucide-icon [img]="X" [size]="18"></lucide-icon>
            </button>
          </div>
          <form class="create-form" (ngSubmit)="createUser()">
            <div class="form-row">
              <div class="form-group">
                <label>Vorname</label>
                <input type="text" [(ngModel)]="newUser.firstName" name="firstName" required>
              </div>
              <div class="form-group">
                <label>Nachname</label>
                <input type="text" [(ngModel)]="newUser.lastName" name="lastName" required>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>E-Mail</label>
                <input type="email" [(ngModel)]="newUser.email" name="email" required>
              </div>
              <div class="form-group">
                <label>Benutzername</label>
                <input type="text" [(ngModel)]="newUser.username" name="username" required>
              </div>
            </div>
            <div class="form-group" style="max-width: 320px;">
              <label>Passwort</label>
              <input type="password" [(ngModel)]="newUser.password" name="password" required minlength="8">
            </div>
            @if (createError()) {
              <p class="feedback error">{{ createError() }}</p>
            }
            <div class="form-actions">
              <button type="button" class="btn-secondary" (click)="showCreate.set(false)">Abbrechen</button>
              <button type="submit" class="btn-primary" [disabled]="creating()">
                {{ creating() ? 'Erstellen...' : 'Benutzer erstellen' }}
              </button>
            </div>
          </form>
        </div>
      }

      <!-- Table card -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">
            <lucide-icon [img]="Users" [size]="18"></lucide-icon>
            Alle Benutzer
            @if (users().length > 0) {
              <span class="count-badge">{{ users().length }}</span>
            }
          </div>
          <button class="btn-primary" (click)="openCreate()">
            <lucide-icon [img]="UserPlus" [size]="16"></lucide-icon>
            Neuer Benutzer
          </button>
        </div>

        @if (loading()) {
          <div class="loading-row">Laden...</div>
        } @else if (users().length === 0) {
          <div class="empty-row">Keine Benutzer gefunden.</div>
        } @else {
          <div class="table-wrapper">
            <table class="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>E-Mail</th>
                  <th>Benutzername</th>
                  <th>Rolle</th>
                  <th>Bestätigt</th>
                  <th class="col-actions">Aktionen</th>
                </tr>
              </thead>
              <tbody>
                @for (user of users(); track user.id) {
                  <tr>
                    <td class="cell-name">
                      <div class="avatar">{{ (user.firstName || user.username).charAt(0).toUpperCase() }}</div>
                      <span>{{ user.firstName }} {{ user.lastName }}</span>
                    </td>
                    <td class="text-muted">{{ user.email }}</td>
                    <td class="text-muted">{{ user.username }}</td>
                    <td>
                      <div class="role-cell">
                        <select
                          [ngModel]="user.pendingRole"
                          (ngModelChange)="setPendingRole(user.id, $event)"
                          class="role-select"
                        >
                          @for (role of roles; track role) {
                            <option [value]="role">{{ role }}</option>
                          }
                        </select>
                        @if (user.pendingRole !== user.role) {
                          <button
                            class="save-role-btn"
                            (click)="saveRole(user.id)"
                            [disabled]="user.saving"
                            title="Rolle speichern"
                          >
                            <lucide-icon [img]="Check" [size]="14"></lucide-icon>
                          </button>
                        }
                      </div>
                    </td>
                    <td>
                      <span class="verified-badge" [class.verified]="user.emailVerified">
                        {{ user.emailVerified ? 'Ja' : 'Nein' }}
                      </span>
                    </td>
                    <td class="col-actions">
                      <button class="icon-btn danger" (click)="deleteUser(user.id)" title="Benutzer löschen">
                        <lucide-icon [img]="Trash2" [size]="16"></lucide-icon>
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .admin-page { display: flex; flex-direction: column; gap: 1.5rem; }

    /* Create panel */
    .create-panel {
      background: white;
      border-radius: 0.75rem;
      border: 1px solid var(--admin-border);
      box-shadow: 0 1px 3px rgba(0,0,0,0.08);
      overflow: hidden;
    }

    .panel-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid var(--admin-border);
    }

    .panel-title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 600;
      font-size: 0.9375rem;
      color: var(--admin-text);
      letter-spacing: normal;
    }

    .create-form {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;

      label { font-size: 0.8125rem; font-weight: 500; color: var(--admin-text-muted); letter-spacing: normal; }

      input {
        padding: 0.5rem 0.75rem;
        border: 1px solid var(--admin-border);
        border-radius: 0.375rem;
        font-size: 0.875rem;
        font-family: inherit;
        color: var(--admin-text);
        outline: none;
        transition: border-color 0.15s;

        &:focus { border-color: var(--admin-primary); }
      }
    }

    .form-actions { display: flex; gap: 0.75rem; justify-content: flex-end; }

    .feedback { font-size: 0.8125rem; margin: 0; letter-spacing: normal; &.error { color: #ef4444; } }

    /* Card */
    .card {
      background: white;
      border-radius: 0.75rem;
      border: 1px solid var(--admin-border);
      box-shadow: 0 1px 2px rgba(0,0,0,0.05);
      overflow: hidden;
    }

    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
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

    .count-badge {
      background: #f3f4f6;
      color: var(--admin-text-muted);
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0.125rem 0.5rem;
      border-radius: 9999px;
    }

    .loading-row, .empty-row {
      padding: 3rem 1.5rem;
      text-align: center;
      font-size: 0.875rem;
      color: var(--admin-text-muted);
      letter-spacing: normal;
    }

    /* Table */
    .table-wrapper { overflow-x: auto; }

    .table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;

      th {
        padding: 0.75rem 1.25rem;
        background: #f9fafb;
        font-weight: 600;
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--admin-text-muted);
        border-bottom: 1px solid var(--admin-border);
        white-space: nowrap;
      }

      td {
        padding: 0.875rem 1.25rem;
        border-bottom: 1px solid var(--admin-border);
        font-size: 0.875rem;
        color: var(--admin-text);
        vertical-align: middle;
      }

      tr:last-child td { border-bottom: none; }
      tr:hover td { background: #fafafa; }
    }

    .cell-name {
      display: flex;
      align-items: center;
      gap: 0.625rem;
      font-weight: 500;
      white-space: nowrap;
    }

    .avatar {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: var(--admin-primary);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: 600;
      flex-shrink: 0;
    }

    .text-muted { color: var(--admin-text-muted); }

    .role-cell { display: flex; align-items: center; gap: 0.375rem; }

    .role-select {
      padding: 0.3rem 0.5rem;
      border: 1px solid var(--admin-border);
      border-radius: 0.375rem;
      font-size: 0.8125rem;
      font-family: inherit;
      color: var(--admin-text);
      background: white;
      outline: none;
      cursor: pointer;
      max-width: 160px;

      &:focus { border-color: var(--admin-primary); }
    }

    .save-role-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 26px;
      height: 26px;
      background: #dcfce7;
      color: #16a34a;
      border: none;
      border-radius: 0.375rem;
      cursor: pointer;
      transition: background 0.15s;
      flex-shrink: 0;

      &:hover { background: #bbf7d0; }
      &:disabled { opacity: 0.5; cursor: not-allowed; }
    }

    .verified-badge {
      font-size: 0.75rem;
      font-weight: 500;
      padding: 0.2rem 0.5rem;
      border-radius: 9999px;
      background: #f3f4f6;
      color: #6b7280;

      &.verified { background: #dcfce7; color: #15803d; }
    }

    .col-actions { width: 60px; text-align: center; }

    /* Buttons */
    .btn-primary {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      padding: 0.5rem 1rem;
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

    .btn-secondary {
      padding: 0.5rem 1rem;
      background: white;
      color: var(--admin-text);
      border: 1px solid var(--admin-border);
      border-radius: 0.375rem;
      font-size: 0.875rem;
      font-weight: 500;
      font-family: inherit;
      cursor: pointer;
      transition: background 0.15s;

      &:hover { background: #f9fafb; }
    }

    .icon-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      background: none;
      border: none;
      border-radius: 0.375rem;
      cursor: pointer;
      color: var(--admin-text-muted);
      transition: all 0.15s;

      &:hover { background: #f3f4f6; color: var(--admin-text); }
      &.danger:hover { background: #fee2e2; color: #ef4444; }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersListComponent implements OnInit {
  private userService = inject(UserService);

  readonly UserPlus = UserPlus;
  readonly ShieldCheck = ShieldCheck;
  readonly Trash2 = Trash2;
  readonly X = X;
  readonly Check = Check;
  readonly Users = Users;

  readonly roles = ROLES;

  users = signal<UserRow[]>([]);
  loading = signal(true);

  showCreate = signal(false);
  creating = signal(false);
  createError = signal<string | null>(null);
  newUser: RegisterRequest = this.emptyForm();

  ngOnInit(): void {
    this.loadUsers();
  }

  private loadUsers(): void {
    this.loading.set(true);
    this.userService.getAllUsers().subscribe({
      next: (list) => {
        this.users.set(list.map(u => ({ ...u, pendingRole: u.role, saving: false })));
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  openCreate(): void {
    this.newUser = this.emptyForm();
    this.createError.set(null);
    this.showCreate.set(true);
  }

  createUser(): void {
    this.creating.set(true);
    this.createError.set(null);
    this.userService.createUser(this.newUser).subscribe({
      next: () => {
        this.creating.set(false);
        this.showCreate.set(false);
        this.loadUsers();
      },
      error: () => {
        this.createError.set('Fehler beim Erstellen des Benutzers.');
        this.creating.set(false);
      },
    });
  }

  setPendingRole(id: string, role: string): void {
    this.users.update(list =>
      list.map(u => u.id === id ? { ...u, pendingRole: role } : u)
    );
  }

  saveRole(id: string): void {
    const user = this.users().find(u => u.id === id);
    if (!user) return;
    this.users.update(list => list.map(u => u.id === id ? { ...u, saving: true } : u));
    this.userService.updateUserRole(id, user.pendingRole).subscribe({
      next: () => {
        this.users.update(list =>
          list.map(u => u.id === id ? { ...u, role: u.pendingRole, saving: false } : u)
        );
      },
      error: () => {
        this.users.update(list =>
          list.map(u => u.id === id ? { ...u, pendingRole: u.role, saving: false } : u)
        );
      },
    });
  }

  deleteUser(id: string): void {
    if (!confirm('Konto wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.')) return;
    this.userService.deleteUser(id).subscribe({
      next: () => this.users.update(list => list.filter(u => u.id !== id)),
    });
  }

  private emptyForm(): RegisterRequest {
    return { firstName: '', lastName: '', email: '', username: '', password: '' };
  }
}
