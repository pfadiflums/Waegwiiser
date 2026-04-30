import { ChangeDetectionStrategy, Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, UserPlus, Trash2, X, Check, ShieldCheck, Mail, Key, Link as LinkIcon } from 'lucide-angular';
import { UserService } from '../../../services/user.service';
import { UserResponse, CreateUserRequest } from '../../../models/auth.model';

const ROLES = ['ADMIN', 'ABTEILUNGSLEITER', 'STUFENLEITER', 'LEITER', 'BENUTZER'];

interface AccountRow extends UserResponse {
  pendingRole: string;
  currentRole: string;
  saving: boolean;
}

@Component({
  selector: 'app-accounts-list',
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
              Neues Benutzerkonto
            </span>
            <button class="icon-btn" (click)="showCreate.set(false)">
              <lucide-icon [img]="X" [size]="18"></lucide-icon>
            </button>
          </div>
          <form class="create-form" (ngSubmit)="createUser()">
            <div class="form-row">
              <div class="form-group">
                <label>Vorname</label>
                <input type="text" [(ngModel)]="newUser.firstName" name="firstName">
              </div>
              <div class="form-group">
                <label>Nachname</label>
                <input type="text" [(ngModel)]="newUser.lastName" name="lastName">
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>E-Mail *</label>
                <input type="email" [(ngModel)]="newUser.email" name="email" required>
              </div>
              <div class="form-group">
                <label>Benutzername</label>
                <input type="text" [(ngModel)]="newUser.username" name="username">
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Passwort * (min. 8 Zeichen)</label>
                <input type="password" [(ngModel)]="newUser.password" name="password" required minlength="8">
              </div>
              <div class="form-group">
                <label>Rolle *</label>
                <select [(ngModel)]="newUser.role" name="role" required>
                  @for (role of roles; track role) {
                    <option [value]="role">{{ role }}</option>
                  }
                </select>
              </div>
            </div>
            @if (createError()) {
              <p class="feedback error">{{ createError() }}</p>
            }
            <div class="form-actions">
              <button type="button" class="btn-secondary" (click)="showCreate.set(false)">Abbrechen</button>
              <button type="submit" class="btn-primary" [disabled]="creating()">
                {{ creating() ? 'Erstellen...' : 'Konto erstellen' }}
              </button>
            </div>
          </form>
        </div>
      }

      <!-- Table card -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">
            <lucide-icon [img]="ShieldCheck" [size]="18"></lucide-icon>
            Konten & Zugriffsverwaltung
            @if (accounts().length > 0) {
              <span class="count-badge">{{ accounts().length }}</span>
            }
          </div>
          <button class="btn-primary" (click)="openCreate()">
            <lucide-icon [img]="UserPlus" [size]="16"></lucide-icon>
            Neues Konto
          </button>
        </div>

        @if (loading()) {
          <div class="loading-row">Laden...</div>
        } @else if (accounts().length === 0) {
          <div class="empty-row">Keine Konten gefunden.</div>
        } @else {
          <div class="table-wrapper">
            <table class="table">
              <thead>
                <tr>
                  <th>Benutzer</th>
                  <th>E-Mail</th>
                  <th>Rolle</th>
                  <th>OAuth Anbieter</th>
                  <th class="col-actions">Aktionen</th>
                </tr>
              </thead>
              <tbody>
                @for (account of accounts(); track account.id) {
                  <tr>
                    <td class="cell-name">
                      <div class="avatar">{{ (account.firstName || account.username || account.email).charAt(0).toUpperCase() }}</div>
                      <div class="user-info">
                        <div class="user-display-name">{{ account.firstName }} {{ account.lastName }}</div>
                        @if (account.username) {
                          <div class="user-username">&#64;{{ account.username }}</div>
                        }
                      </div>
                    </td>
                    <td>
                      <div class="email-cell">
                        <lucide-icon [img]="Mail" [size]="14" class="email-icon"></lucide-icon>
                        {{ account.email }}
                      </div>
                    </td>
                    <td>
                      <div class="role-cell">
                        <select
                          [ngModel]="account.pendingRole"
                          (ngModelChange)="setPendingRole(account.id, $event)"
                          class="role-select"
                        >
                          @for (role of roles; track role) {
                            <option [value]="role">{{ role }}</option>
                          }
                        </select>
                        @if (account.pendingRole !== account.currentRole) {
                          <button
                            class="save-role-btn"
                            (click)="saveRole(account.id)"
                            [disabled]="account.saving"
                            title="Rolle speichern"
                          >
                            <lucide-icon [img]="Check" [size]="14"></lucide-icon>
                          </button>
                        }
                      </div>
                    </td>
                    <td>
                      @if (account.connectedProviders.length > 0) {
                        <div class="providers-cell">
                          @for (provider of account.connectedProviders; track provider) {
                            <span class="provider-badge">
                              <lucide-icon [img]="LinkIcon" [size]="12"></lucide-icon>
                              {{ provider }}
                            </span>
                          }
                        </div>
                      } @else {
                        <span class="text-muted">–</span>
                      }
                    </td>
                    <td class="col-actions">
                      <button class="icon-btn" (click)="openResetPassword(account)" title="Passwort zurücksetzen">
                        <lucide-icon [img]="Key" [size]="16"></lucide-icon>
                      </button>
                      <button class="icon-btn danger" (click)="deleteUser(account.id)" title="Konto löschen">
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

      <!-- Password reset modal -->
      @if (showPasswordReset()) {
        <div class="modal-backdrop" (click)="showPasswordReset.set(false)">
          <div class="modal" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <span class="modal-title">
                <lucide-icon [img]="Key" [size]="18"></lucide-icon>
                Passwort zurücksetzen
              </span>
              <button class="icon-btn" (click)="showPasswordReset.set(false)">
                <lucide-icon [img]="X" [size]="18"></lucide-icon>
              </button>
            </div>
            <div class="modal-body">
              <p class="modal-description">
                Passwort für <strong>{{ selectedAccount()?.firstName }} {{ selectedAccount()?.lastName || selectedAccount()?.email }}</strong> zurücksetzen.
              </p>
              <div class="form-group">
                <label>Neues Passwort</label>
                <input type="password" [(ngModel)]="newPassword" placeholder="Mindestens 8 Zeichen" minlength="8">
              </div>
              @if (resetError()) {
                <p class="feedback error">{{ resetError() }}</p>
              }
            </div>
            <div class="modal-footer">
              <button type="button" class="btn-secondary" (click)="showPasswordReset.set(false)">Abbrechen</button>
              <button type="button" class="btn-primary" (click)="resetPassword()" [disabled]="resetting()">
                {{ resetting() ? 'Zurücksetzen...' : 'Passwort zurücksetzen' }}
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .admin-page { display: flex; flex-direction: column; gap: 1.5rem; }

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

      input, select {
        padding: 0.5rem 0.75rem;
        border: 1px solid var(--admin-border);
        border-radius: 0.375rem;
        font-size: 0.875rem;
        font-family: inherit;
        color: var(--admin-text);
        outline: none;
        transition: border-color 0.15s;
        background: white;

        &:focus { border-color: var(--admin-primary); }
      }
    }

    .form-actions { display: flex; gap: 0.75rem; justify-content: flex-end; }

    .feedback { font-size: 0.8125rem; margin: 0; letter-spacing: normal; &.error { color: #ef4444; } }

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
      gap: 0.75rem;
      white-space: nowrap;
    }

    .avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: var(--admin-primary);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.875rem;
      font-weight: 600;
      flex-shrink: 0;
    }

    .user-info { display: flex; flex-direction: column; gap: 0.125rem; }

    .user-display-name { font-weight: 500; color: var(--admin-text); }

    .user-username { font-size: 0.75rem; color: var(--admin-text-muted); }

    .email-cell {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      color: var(--admin-text-muted);
    }

    .email-icon { opacity: 0.5; }

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

    .providers-cell { display: flex; flex-wrap: wrap; gap: 0.25rem; }

    .provider-badge {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.6875rem;
      font-weight: 500;
      padding: 0.125rem 0.375rem;
      border-radius: 0.25rem;
      background: #e0e7ff;
      color: #4338ca;
      text-transform: uppercase;
    }

    .col-actions {
      width: 100px;
      text-align: right;

      > * { display: inline-flex; }
    }

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

    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal {
      background: white;
      border-radius: 0.75rem;
      box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
      max-width: 480px;
      width: 90%;
    }

    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid var(--admin-border);
    }

    .modal-title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 600;
      font-size: 0.9375rem;
      color: var(--admin-text);
      letter-spacing: normal;
    }

    .modal-body {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .modal-description {
      font-size: 0.875rem;
      color: var(--admin-text-muted);
      margin: 0;
      letter-spacing: normal;
    }

    .modal-footer {
      display: flex;
      gap: 0.75rem;
      justify-content: flex-end;
      padding: 1rem 1.5rem;
      border-top: 1px solid var(--admin-border);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountsListComponent implements OnInit {
  private userService = inject(UserService);

  readonly UserPlus = UserPlus;
  readonly ShieldCheck = ShieldCheck;
  readonly Trash2 = Trash2;
  readonly X = X;
  readonly Check = Check;
  readonly Mail = Mail;
  readonly Key = Key;
  readonly LinkIcon = LinkIcon;

  readonly roles = ROLES;

  accounts = signal<AccountRow[]>([]);
  loading = signal(true);

  showCreate = signal(false);
  creating = signal(false);
  createError = signal<string | null>(null);
  newUser: CreateUserRequest = this.emptyForm();

  showPasswordReset = signal(false);
  selectedAccount = signal<AccountRow | null>(null);
  newPassword = '';
  resetting = signal(false);
  resetError = signal<string | null>(null);

  ngOnInit(): void {
    this.loadAccounts();
  }

  private loadAccounts(): void {
    this.loading.set(true);
    this.userService.getAllUsers().subscribe({
      next: (list) => {
        this.accounts.set(list.map(u => ({
          ...u,
          currentRole: u.roles[0] ?? 'BENUTZER',
          pendingRole: u.roles[0] ?? 'BENUTZER',
          saving: false,
        })));
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
        this.loadAccounts();
      },
      error: () => {
        this.createError.set('Fehler beim Erstellen des Kontos.');
        this.creating.set(false);
      },
    });
  }

  setPendingRole(id: string, role: string): void {
    this.accounts.update(list =>
      list.map(a => a.id === id ? { ...a, pendingRole: role } : a)
    );
  }

  saveRole(id: string): void {
    const account = this.accounts().find(a => a.id === id);
    if (!account) return;
    this.accounts.update(list => list.map(a => a.id === id ? { ...a, saving: true } : a));
    this.userService.adminUpdateRole(id, [account.pendingRole]).subscribe({
      next: () => {
        this.accounts.update(list =>
          list.map(a => a.id === id ? { ...a, currentRole: a.pendingRole, saving: false } : a)
        );
      },
      error: () => {
        this.accounts.update(list =>
          list.map(a => a.id === id ? { ...a, pendingRole: a.currentRole, saving: false } : a)
        );
      },
    });
  }

  openResetPassword(account: AccountRow): void {
    this.selectedAccount.set(account);
    this.newPassword = '';
    this.resetError.set(null);
    this.showPasswordReset.set(true);
  }

  resetPassword(): void {
    const account = this.selectedAccount();
    if (!account || !this.newPassword || this.newPassword.length < 8) {
      this.resetError.set('Passwort muss mindestens 8 Zeichen haben.');
      return;
    }
    this.resetting.set(true);
    this.userService.adminResetPassword(account.id, this.newPassword).subscribe({
      next: () => {
        this.resetting.set(false);
        this.showPasswordReset.set(false);
      },
      error: () => {
        this.resetError.set('Fehler beim Zurücksetzen des Passworts.');
        this.resetting.set(false);
      },
    });
  }

  deleteUser(id: string): void {
    if (!confirm('Konto wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.')) return;
    this.userService.deleteUser(id).subscribe({
      next: () => this.accounts.update(list => list.filter(a => a.id !== id)),
    });
  }

  private emptyForm(): CreateUserRequest {
    return { firstName: '', lastName: '', email: '', username: '', password: '', role: 'BENUTZER' };
  }
}
