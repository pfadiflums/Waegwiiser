import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import {FormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, User, Lock, Link, Unlink, Check, X } from 'lucide-angular';
import { UserService, UpdateProfileRequest } from '../../../services/user.service';
import { UserResponse } from '../../../models/auth.model';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="admin-page">

      @if (user(); as u) {
        <!-- Profile -->
        <div class="card">
          <div class="card-header">
            <div class="card-title">
              <lucide-icon [img]="User" [size]="18"></lucide-icon>
              Mein Profil
            </div>
          </div>
          <div class="card-body">
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
              <span class="role-badge">{{ u.roles[0] }}</span>
            </div>

            <div class="form-divider"></div>

            <form class="form" (ngSubmit)="saveProfile()">
              <div class="form-row">
                <div class="form-group">
                  <label>Vorname</label>
                  <input type="text" [(ngModel)]="profileForm.firstName" name="firstName">
                </div>
                <div class="form-group">
                  <label>Nachname</label>
                  <input type="text" [(ngModel)]="profileForm.lastName" name="lastName">
                </div>
              </div>
              @if (profileMsg()) {
                <p class="feedback" [class.success]="profileSuccess()">{{ profileMsg() }}</p>
              }
              <div class="form-actions">
                <button type="submit" class="btn-primary" [disabled]="savingProfile()">
                  {{ savingProfile() ? 'Speichern...' : 'Speichern' }}
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Password -->
        <div class="card">
          <div class="card-header">
            <div class="card-title">
              <lucide-icon [img]="Lock" [size]="18"></lucide-icon>
              Passwort ändern
            </div>
          </div>
          <div class="card-body">
            <form class="form" (ngSubmit)="changePassword()">
              <div class="form-group">
                <label>Aktuelles Passwort</label>
                <input type="password" [(ngModel)]="pwForm.currentPassword" name="currentPassword">
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Neues Passwort</label>
                  <input type="password" [(ngModel)]="pwForm.newPassword" name="newPassword">
                </div>
                <div class="form-group">
                  <label>Passwort bestätigen</label>
                  <input type="password" [(ngModel)]="pwConfirm" name="pwConfirm">
                </div>
              </div>
              @if (pwMsg()) {
                <p class="feedback" [class.success]="pwSuccess()">{{ pwMsg() }}</p>
              }
              <div class="form-actions">
                <button type="submit" class="btn-primary" [disabled]="savingPw()">
                  {{ savingPw() ? 'Ändern...' : 'Passwort ändern' }}
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Connected Accounts -->
        <div class="card">
          <div class="card-header">
            <div class="card-title">
              <lucide-icon [img]="Link" [size]="18"></lucide-icon>
              Verknüpfte Accounts
            </div>
          </div>
          <div class="card-body">
            @if (u.connectedProviders.length === 0) {
              <p class="empty-text">Keine externen Accounts verknüpft.</p>
            } @else {
              <div class="providers-list">
                @for (provider of u.connectedProviders; track provider) {
                  <div class="provider-row">
                    <div class="provider-info">
                      <lucide-icon [img]="Link" [size]="16"></lucide-icon>
                      <span>{{ provider }}</span>
                    </div>
                    <button class="btn-danger-sm" (click)="disconnect(provider)">
                      <lucide-icon [img]="Unlink" [size]="14"></lucide-icon>
                      Trennen
                    </button>
                  </div>
                }
              </div>
            }
          </div>
        </div>
      } @else if (loading()) {
        <p class="loading-text">Laden...</p>
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

    .card-body { padding: 1.5rem; display: flex; flex-direction: column; gap: 1.25rem; }

    .meta-row {
      display: flex;
      align-items: center;
      gap: 1rem;
      font-size: 0.875rem;
    }

    .meta-label { color: var(--admin-text-muted); width: 120px; flex-shrink: 0; }
    .meta-value { color: var(--admin-text); font-weight: 500; }

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

    .form-divider { height: 1px; background: var(--admin-border); margin: 0.25rem 0; }

    .form { display: flex; flex-direction: column; gap: 1rem; }

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

    .form-actions { display: flex; justify-content: flex-end; }

    .btn-primary {
      padding: 0.5rem 1.25rem;
      background: var(--admin-primary);
      color: white;
      border: none;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      font-weight: 500;
      font-family: inherit;
      cursor: pointer;
      transition: background 0.2s;

      &:hover:not(:disabled) { background: #4f46e5; }
      &:disabled { opacity: 0.6; cursor: not-allowed; }
    }

    .feedback {
      font-size: 0.8125rem;
      color: #ef4444;
      margin: 0;
      letter-spacing: normal;

      &.success { color: #059669; }
    }

    .empty-text { font-size: 0.875rem; color: var(--admin-text-muted); letter-spacing: normal; margin: 0; }

    .providers-list { display: flex; flex-direction: column; gap: 0.75rem; }

    .provider-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.75rem 1rem;
      background: #f9fafb;
      border-radius: 0.5rem;
      border: 1px solid var(--admin-border);
    }

    .provider-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      font-weight: 500;
      text-transform: capitalize;
      color: var(--admin-text);
    }

    .btn-danger-sm {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      padding: 0.375rem 0.75rem;
      background: none;
      border: 1px solid #fca5a5;
      color: #ef4444;
      border-radius: 0.375rem;
      font-size: 0.8125rem;
      font-weight: 500;
      font-family: inherit;
      cursor: pointer;
      transition: all 0.2s;

      &:hover { background: #fee2e2; }
    }

    .loading-text { color: var(--admin-text-muted); font-size: 0.875rem; letter-spacing: normal; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountComponent implements OnInit {
  private userService = inject(UserService);

  readonly User = User;
  readonly Lock = Lock;
  readonly Link = Link;
  readonly Unlink = Unlink;
  readonly Check = Check;
  readonly X = X;

  user = signal<UserResponse | null>(null);
  loading = signal(true);

  profileForm: UpdateProfileRequest = { firstName: '', lastName: '' };
  savingProfile = signal(false);
  profileMsg = signal<string | null>(null);
  profileSuccess = signal(false);

  pwForm = { currentPassword: '', newPassword: '' };
  pwConfirm = '';
  savingPw = signal(false);
  pwMsg = signal<string | null>(null);
  pwSuccess = signal(false);

  ngOnInit(): void {
    this.userService.getMe().subscribe({
      next: (u) => {
        this.user.set(u);
        this.profileForm = { firstName: u.firstName, lastName: u.lastName };
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  saveProfile(): void {
    this.savingProfile.set(true);
    this.profileMsg.set(null);
    this.userService.updateMe(this.profileForm).subscribe({
      next: () => {
        this.profileSuccess.set(true);
        this.profileMsg.set('Profil gespeichert.');
        this.savingProfile.set(false);
      },
      error: () => {
        this.profileSuccess.set(false);
        this.profileMsg.set('Fehler beim Speichern.');
        this.savingProfile.set(false);
      },
    });
  }

  changePassword(): void {
    if (this.pwForm.newPassword !== this.pwConfirm) {
      this.pwSuccess.set(false);
      this.pwMsg.set('Passwörter stimmen nicht überein.');
      return;
    }
    this.savingPw.set(true);
    this.pwMsg.set(null);
    this.userService.updatePassword(this.pwForm).subscribe({
      next: () => {
        this.pwSuccess.set(true);
        this.pwMsg.set('Passwort geändert.');
        this.pwForm = { currentPassword: '', newPassword: '' };
        this.pwConfirm = '';
        this.savingPw.set(false);
      },
      error: () => {
        this.pwSuccess.set(false);
        this.pwMsg.set('Fehler beim Ändern des Passworts.');
        this.savingPw.set(false);
      },
    });
  }

  disconnect(provider: string): void {
    if (!confirm(`${provider}-Verknüpfung aufheben?`)) return;
    this.userService.removeConnection(provider).subscribe({
      next: () => {
        const u = this.user();
        if (u) {
          this.user.set({ ...u, connectedProviders: u.connectedProviders.filter(p => p !== provider) });
        }
      },
    });
  }
}
