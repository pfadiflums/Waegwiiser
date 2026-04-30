import { ChangeDetectionStrategy, Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, UserPlus, Users, Trash2, X, Edit, Link as LinkIcon, Unlink } from 'lucide-angular';
import { PersonService } from '../../../services/person.service';
import { UserService } from '../../../services/user.service';
import { StufeService } from '../../../services/stufe.service';
import { AuthService } from '../../../services/auth.service';
import { PersonResponse, PersonStufeRolle, CreatePersonRequest, UpdatePersonProfileRequest, AssignStufeRequest } from '../../../models/person.model';
import { UserResponse } from '../../../models/auth.model';
import { Stufe } from '../../../models/stufe.model';
import { forkJoin } from 'rxjs';

interface KnownUser { id: string; label: string; }

@Component({
  selector: 'app-people-list',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="admin-page">

      <!-- Create/Edit panel -->
      @if (showForm()) {
        <div class="create-panel">
          <div class="panel-header">
            <span class="panel-title">
              <lucide-icon [img]="UserPlus" [size]="18"></lucide-icon>
              {{ editingPerson() ? 'Person bearbeiten' : 'Neue Person' }}
            </span>
            <button class="icon-btn" (click)="closeForm()">
              <lucide-icon [img]="X" [size]="18"></lucide-icon>
            </button>
          </div>
          <form class="create-form" (ngSubmit)="savePerson()">
            <div class="form-row">
              <div class="form-group">
                <label>Vorname *</label>
                <input type="text" [(ngModel)]="formData.firstName" name="firstName" required>
              </div>
              <div class="form-group">
                <label>Nachname *</label>
                <input type="text" [(ngModel)]="formData.lastName" name="lastName" required>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Pfadiname</label>
                <input type="text" [(ngModel)]="formData.nickname" name="nickname">
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>E-Mail</label>
                <input type="email" [(ngModel)]="formData.email" name="email">
              </div>
              <div class="form-group">
                <label>Telefon</label>
                <input type="tel" [(ngModel)]="formData.phone" name="phone">
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Geburtsdatum</label>
                <input type="date" [(ngModel)]="formData.dateOfBirth" name="dateOfBirth">
              </div>
              @if (editingPerson()) {
                <div class="form-group">
                  <label>Bio</label>
                  <input type="text" [(ngModel)]="formDataEdit.bio" name="bio">
                </div>
              }
            </div>
            @if (formError()) {
              <p class="feedback error">{{ formError() }}</p>
            }
            <div class="form-actions">
              <button type="button" class="btn-secondary" (click)="closeForm()">Abbrechen</button>
              <button type="submit" class="btn-primary" [disabled]="saving()">
                {{ saving() ? 'Speichern...' : (editingPerson() ? 'Änderungen speichern' : 'Person erstellen') }}
              </button>
            </div>
          </form>
        </div>
      }

      <!-- Assign Stufe panel -->
      @if (showAssignStufe()) {
        <div class="create-panel">
          <div class="panel-header">
            <span class="panel-title">Stufe zuweisen — {{ assigningPerson()?.firstName }} {{ assigningPerson()?.lastName }}</span>
            <button class="icon-btn" (click)="showAssignStufe.set(false)"><lucide-icon [img]="X" [size]="18"></lucide-icon></button>
          </div>
          <div class="create-form">
            <div class="form-row">
              <div class="form-group">
                <label>Stufe</label>
                <select [(ngModel)]="assignStufeId">
                  <option value="">Stufe wählen...</option>
                  @for (stufe of stufen(); track stufe.id) {
                    <option [value]="stufe.id">{{ stufe.name }}</option>
                  }
                </select>
              </div>
              <div class="form-group">
                <label>Rolle</label>
                <select [(ngModel)]="assignRolle">
                  @for (r of STUFE_ROLLEN; track r) {
                    <option [value]="r">{{ r }}</option>
                  }
                </select>
              </div>
            </div>
            <div class="form-actions">
              <button type="button" class="btn-secondary" (click)="showAssignStufe.set(false)">Abbrechen</button>
              <button type="button" class="btn-primary" (click)="doAssignStufe()" [disabled]="!assignStufeId">Zuweisen</button>
            </div>
          </div>
        </div>
      }

      <!-- Filter by Stufe -->
      <div class="filter-bar">
        <div class="filter-group">
          <label>Filtern nach Stufe:</label>
          <select [ngModel]="selectedStufeFilter()" (ngModelChange)="selectedStufeFilter.set($event)" class="filter-select">
            <option [value]="null">Alle Stufen</option>
            @for (stufe of stufen(); track stufe.id) {
              <option [value]="stufe.id">{{ stufe.name }}</option>
            }
          </select>
        </div>
      </div>

      <!-- Table card -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">
            <lucide-icon [img]="Users" [size]="18"></lucide-icon>
            Personen verwalten
            @if (filteredPeople().length > 0) {
              <span class="count-badge">{{ filteredPeople().length }}</span>
            }
          </div>
          @if (canCreatePerson()) {
            <button class="btn-primary" (click)="openCreate()">
              <lucide-icon [img]="UserPlus" [size]="16"></lucide-icon>
              Neue Person
            </button>
          }
        </div>

        @if (loading()) {
          <div class="loading-row">Laden...</div>
        } @else if (filteredPeople().length === 0) {
          <div class="empty-row">
            {{ people().length === 0 ? 'Keine Personen gefunden.' : 'Keine Personen in dieser Stufe.' }}
          </div>
        } @else {
          <div class="table-wrapper">
            <table class="table">
              <thead>
                <tr>
                  <th>Pfadiname</th>
                  <th>Name</th>
                  <th>E-Mail</th>
                  <th>Stufen</th>
                  <th>Verknüpftes Konto</th>
                  <th class="col-actions">Aktionen</th>
                </tr>
              </thead>
              <tbody>
                @for (person of filteredPeople(); track person.id) {
                  <tr>
                    <td class="cell-name">
                      <div class="avatar">{{ (person.nickname || person.firstName).charAt(0).toUpperCase() }}</div>
                      <span class="pfadiname">{{ person.nickname || '–' }}</span>
                    </td>
                    <td>{{ person.firstName }} {{ person.lastName }}</td>
                    <td class="text-muted">{{ person.email || '–' }}</td>
                    <td>
                      @if (activeAssignments(person).length > 0) {
                        <div class="stufe-list">
                          @for (a of activeAssignments(person); track a.stufeId) {
                            <span class="stufe-badge">
                              {{ stufeName(a.stufeId) }}
                              @if (a.rolle) {
                                <span class="rolle-label">{{ a.rolle }}</span>
                              }
                              <button class="remove-stufe-btn" (click)="removeFromStufe(person, a.stufeId)" title="Entfernen">×</button>
                            </span>
                          }
                        </div>
                      } @else {
                        <span class="text-muted">–</span>
                      }
                      <button class="add-stufe-btn" (click)="openAssignStufe(person)" title="Stufe zuweisen">+</button>
                    </td>
                    <td>
                      @if (person.linkedUser) {
                        <div class="linked-user">
                          <lucide-icon [img]="LinkIcon" [size]="14" class="link-icon"></lucide-icon>
                          <span>{{ person.linkedUser.username || person.linkedUser.email }}</span>
                          @if (canUnlinkPerson(person)) {
                            <button class="unlink-btn" (click)="unlinkAccount(person.id)" title="Verknüpfung aufheben">
                              <lucide-icon [img]="Unlink" [size]="12"></lucide-icon>
                            </button>
                          }
                        </div>
                      } @else {
                        <div class="linked-user">
                          <span class="text-muted">Nicht verknüpft</span>
                          @if (canUnlinkPerson(person)) {
                            <button class="add-stufe-btn" (click)="openLinkAccount(person)" title="Konto verknüpfen">
                              <lucide-icon [img]="LinkIcon" [size]="12"></lucide-icon>
                            </button>
                          }
                        </div>
                      }
                    </td>
                    <td class="col-actions">
                      @if (canEditPerson(person)) {
                        <button class="icon-btn" (click)="openEdit(person)" title="Person bearbeiten">
                          <lucide-icon [img]="Edit" [size]="16"></lucide-icon>
                        </button>
                      }
                      @if (canDeletePerson(person)) {
                        <button class="icon-btn danger" (click)="deletePerson(person.id)" title="Person löschen">
                          <lucide-icon [img]="Trash2" [size]="16"></lucide-icon>
                        </button>
                      }
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>

      <!-- Link account modal -->
      @if (showLinkAccount()) {
        <div class="modal-backdrop" (click)="showLinkAccount.set(false)">
          <div class="modal" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <span class="modal-title">
                <lucide-icon [img]="LinkIcon" [size]="18"></lucide-icon>
                Konto verknüpfen — {{ linkingPerson()?.nickname || linkingPerson()?.firstName }}
              </span>
              <button class="icon-btn" (click)="showLinkAccount.set(false)">
                <lucide-icon [img]="X" [size]="18"></lucide-icon>
              </button>
            </div>
            <div class="modal-body">
              @if (knownUsers().length > 0) {
                <div class="form-group">
                  <label>Benutzerkonto auswählen</label>
                  <select [(ngModel)]="linkAccountId" class="modal-select">
                    <option value="">Konto wählen...</option>
                    @for (u of knownUsers(); track u.id) {
                      <option [value]="u.id">{{ u.label }}</option>
                    }
                  </select>
                </div>
              }
              <div class="form-group">
                <label>Oder Konto-ID direkt eingeben</label>
                <input type="text" [(ngModel)]="linkAccountId" placeholder="UUID des Benutzerkontos" class="modal-input">
              </div>
              @if (linkError()) {
                <p class="feedback error">{{ linkError() }}</p>
              }
            </div>
            <div class="modal-footer">
              <button class="btn-secondary" (click)="showLinkAccount.set(false)">Abbrechen</button>
              <button class="btn-primary" (click)="doLinkAccount()" [disabled]="!linkAccountId || linking()">
                {{ linking() ? 'Verknüpfen...' : 'Verknüpfen' }}
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

    .filter-bar {
      background: white;
      padding: 1rem 1.5rem;
      border-radius: 0.75rem;
      border: 1px solid var(--admin-border);
      display: flex;
      gap: 1.5rem;
      align-items: center;
    }

    .filter-group {
      display: flex;
      align-items: center;
      gap: 0.5rem;

      label { font-size: 0.875rem; font-weight: 500; color: var(--admin-text-muted); letter-spacing: normal; }
    }

    .filter-select {
      padding: 0.375rem 0.625rem;
      border: 1px solid var(--admin-border);
      border-radius: 0.375rem;
      font-size: 0.875rem;
      font-family: inherit;
      color: var(--admin-text);
      background: white;
      outline: none;
      cursor: pointer;

      &:focus { border-color: var(--admin-primary); }
    }

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
      gap: 0.625rem;
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

    .pfadiname { font-weight: 500; }

    .stufe-list { display: flex; flex-wrap: wrap; gap: 0.25rem; margin-bottom: 0.25rem; }

    .stufe-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.2rem;
      font-size: 0.75rem;
      font-weight: 500;
      padding: 0.2rem 0.4rem;
      border-radius: 0.25rem;
      background: #e0e7ff;
      color: #4338ca;
    }

    .rolle-label {
      font-size: 0.6875rem;
      background: #c7d2fe;
      border-radius: 0.2rem;
      padding: 0 0.3rem;
      color: #3730a3;
    }

    .remove-stufe-btn {
      background: none;
      border: none;
      cursor: pointer;
      color: #4338ca;
      font-size: 0.875rem;
      line-height: 1;
      padding: 0;
      opacity: 0.6;
      &:hover { opacity: 1; }
    }

    .add-stufe-btn {
      background: none;
      border: 1px dashed var(--admin-border);
      border-radius: 0.25rem;
      cursor: pointer;
      color: var(--admin-text-muted);
      font-size: 0.875rem;
      width: 22px;
      height: 22px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      &:hover { background: #f3f4f6; color: var(--admin-text); }
    }

    .leader-cell {
      display: flex;
      align-items: center;
      gap: 0.375rem;
    }

    .leader-badge {
      font-size: 0.75rem;
      font-weight: 500;
      padding: 0.2rem 0.5rem;
      border-radius: 9999px;
      background: #f3f4f6;
      color: #6b7280;

      &.is-leader { background: #fef3c7; color: #b45309; }
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;

      input[type="checkbox"] { width: 18px; height: 18px; cursor: pointer; }
      span { font-size: 0.875rem; color: var(--admin-text); }
    }

    .linked-user {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      font-size: 0.8125rem;
    }

    .link-icon { color: var(--admin-primary); }

    .unlink-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      background: #fee2e2;
      color: #ef4444;
      border: none;
      border-radius: 0.25rem;
      cursor: pointer;
      transition: background 0.15s;
      flex-shrink: 0;

      &:hover { background: #fecaca; }
    }

    .text-muted { color: var(--admin-text-muted); }

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

      &.small { width: 24px; height: 24px; }
      &:hover { background: #f3f4f6; color: var(--admin-text); }
      &.danger:hover { background: #fee2e2; color: #ef4444; }
    }

    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.5);
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

    .modal-select, .modal-input {
      width: 100%;
      padding: 0.5rem 0.75rem;
      border: 1px solid var(--admin-border);
      border-radius: 0.375rem;
      font-size: 0.875rem;
      font-family: inherit;
      color: var(--admin-text);
      background: white;
      outline: none;
      &:focus { border-color: var(--admin-primary); }
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
export class PeopleListComponent implements OnInit {
  private personService = inject(PersonService);
  private userService = inject(UserService);
  private stufeService = inject(StufeService);
  private authService = inject(AuthService);

  readonly UserPlus = UserPlus;
  readonly Users = Users;
  readonly Trash2 = Trash2;
  readonly X = X;
  readonly Edit = Edit;
  readonly LinkIcon = LinkIcon;
  readonly Unlink = Unlink;
  readonly STUFE_ROLLEN: PersonStufeRolle[] = ['LEITER', 'STUFENLEITER', 'ABTEILUNGSLEITER', 'PRAESIDENT', 'KASSIERERIN', 'AKTUARIN', 'HAUSVERWALTUNG', 'MATERIALWART'];

  people = signal<PersonResponse[]>([]);
  stufen = signal<Stufe[]>([]);
  loading = signal(true);

  currentUser = signal<UserResponse | null>(null);
  selectedStufeFilter = signal<string | null>(null);

  filteredPeople = computed(() => {
    const filter = this.selectedStufeFilter();
    if (!filter) return this.people();
    return this.people().filter(p =>
      p.stufeAssignments.some(a => a.stufeId === filter && a.active)
    );
  });

  showForm = signal(false);
  saving = signal(false);
  formError = signal<string | null>(null);
  editingPerson = signal<PersonResponse | null>(null);

  formData: { firstName: string; lastName: string; nickname: string; email?: string; phone?: string; dateOfBirth?: string } = this.emptySharedForm();
  formDataEdit: { bio?: string } = {};

  showAssignStufe = signal(false);
  assigningPerson = signal<PersonResponse | null>(null);
  assignStufeId = '';
  assignRolle: PersonStufeRolle = 'LEITER';

  showLinkAccount = signal(false);
  linkingPerson = signal<PersonResponse | null>(null);
  linkAccountId = '';
  linking = signal(false);
  linkError = signal<string | null>(null);
  knownUsers = signal<KnownUser[]>([]);

  private stufeMap = computed(() => {
    const map = new Map<string, string>();
    this.stufen().forEach(s => map.set(s.id, s.name));
    return map;
  });

  stufeName(stufeId: string): string {
    return this.stufeMap().get(stufeId) ?? stufeId;
  }

  activeAssignments(person: PersonResponse) {
    return person.stufeAssignments.filter(a => a.active);
  }

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadData();
  }

  private loadCurrentUser(): void {
    this.authService.getCurrentUser().subscribe({
      next: (user) => this.currentUser.set(user),
    });
  }

  private loadData(): void {
    this.loading.set(true);

    Promise.all([
      this.personService.getAllPeople(0, 200).toPromise(),
      this.stufeService.getAll().toPromise(),
    ]).then(([pageResponse, stufenList]) => {
      this.people.set(pageResponse?.items ?? []);
      this.stufen.set(stufenList ?? []);
      this.loading.set(false);
    }).catch(() => {
      this.loading.set(false);
    });
  }

  canCreatePerson(): boolean {
    const roles = this.currentUser()?.roles ?? [];
    return roles.some(r => r === 'ADMIN' || r === 'ABTEILUNGSLEITER' || r === 'STUFENLEITER');
  }

  canEditPerson(person: PersonResponse): boolean {
    const user = this.currentUser();
    if (!user) return false;
    if (user.roles.includes('ADMIN')) return true;
    if (person.linkedUser?.id === user.id) return true;
    if (user.roles.includes('STUFENLEITER')) return true;
    return false;
  }

  canDeletePerson(person: PersonResponse): boolean {
    return this.currentUser()?.roles.includes('ADMIN') ?? false;
  }

  canUnlinkPerson(person: PersonResponse): boolean {
    return this.currentUser()?.roles.includes('ADMIN') ?? false;
  }

  openCreate(): void {
    this.formData = this.emptySharedForm();
    this.editingPerson.set(null);
    this.formError.set(null);
    this.showForm.set(true);
  }

  openEdit(person: PersonResponse): void {
    this.formData = {
      firstName: person.firstName,
      lastName: person.lastName,
      nickname: person.nickname ?? '',
      email: person.email,
      phone: person.phone,
      dateOfBirth: person.dateOfBirth,
    };
    this.formDataEdit = { bio: person.bio };
    this.editingPerson.set(person);
    this.formError.set(null);
    this.showForm.set(true);
  }

  closeForm(): void {
    this.showForm.set(false);
    this.editingPerson.set(null);
  }

  savePerson(): void {
    this.saving.set(true);
    this.formError.set(null);

    const editing = this.editingPerson();

    if (editing) {
      const data: UpdatePersonProfileRequest = {
        firstName: this.formData.firstName,
        lastName: this.formData.lastName,
        nickname: this.formData.nickname,
        bio: this.formDataEdit.bio,
      };
      this.personService.updateProfile(editing.id, data).subscribe({
        next: (updated) => {
          this.people.update(list => list.map(p => p.id === updated.id ? updated : p));
          this.saving.set(false);
          this.showForm.set(false);
        },
        error: () => {
          this.formError.set('Fehler beim Speichern der Person.');
          this.saving.set(false);
        },
      });
    } else {
      const data: CreatePersonRequest = {
        firstName: this.formData.firstName,
        lastName: this.formData.lastName,
        nickname: this.formData.nickname,
        email: this.formData.email,
        phone: this.formData.phone,
        dateOfBirth: this.formData.dateOfBirth,
      };
      this.personService.createPerson(data).subscribe({
        next: () => {
          this.saving.set(false);
          this.showForm.set(false);
          this.loadData();
        },
        error: () => {
          this.formError.set('Fehler beim Erstellen der Person.');
          this.saving.set(false);
        },
      });
    }
  }

  openAssignStufe(person: PersonResponse): void {
    this.assigningPerson.set(person);
    this.assignStufeId = '';
    this.assignRolle = 'LEITER';
    this.showAssignStufe.set(true);
  }

  doAssignStufe(): void {
    const person = this.assigningPerson();
    if (!person || !this.assignStufeId) return;
    const req: AssignStufeRequest = {
      stufeId: this.assignStufeId,
      rolle: this.assignRolle,
    };
    this.personService.assignToStufe(person.id, req).subscribe({
      next: (updated) => {
        this.people.update(list => list.map(p => p.id === updated.id ? updated : p));
        this.showAssignStufe.set(false);
      },
    });
  }

  openLinkAccount(person: PersonResponse): void {
    this.linkingPerson.set(person);
    this.linkAccountId = '';
    this.linkError.set(null);
    this.showLinkAccount.set(true);

    // Build list of known users: current user + users linked to other people
    forkJoin({
      me: this.authService.getCurrentUser(),
      page: this.personService.getAllPeople(0, 500),
    }).subscribe({
      next: ({ me, page }) => {
        const seen = new Set<string>();
        const users: KnownUser[] = [];

        seen.add(me.id);
        users.push({ id: me.id, label: `${me.email} (${me.firstName} ${me.lastName}) — ich` });

        for (const p of page.items) {
          if (p.linkedUser && !seen.has(p.linkedUser.id) && p.id !== person.id) {
            seen.add(p.linkedUser.id);
            users.push({
              id: p.linkedUser.id,
              label: `${p.linkedUser.email} (${p.linkedUser.username || p.firstName + ' ' + p.lastName})`,
            });
          }
        }

        this.knownUsers.set(users);
      },
    });
  }

  doLinkAccount(): void {
    const person = this.linkingPerson();
    if (!person || !this.linkAccountId) return;
    this.linking.set(true);
    this.linkError.set(null);
    this.personService.linkToAccount(person.id, this.linkAccountId).subscribe({
      next: (updated) => {
        this.people.update(list => list.map(p => p.id === updated.id ? updated : p));
        this.linking.set(false);
        this.showLinkAccount.set(false);
      },
      error: () => {
        this.linkError.set('Verknüpfung fehlgeschlagen. Bitte Konto-ID prüfen.');
        this.linking.set(false);
      },
    });
  }

  removeFromStufe(person: PersonResponse, stufeId: string): void {
    if (!confirm('Person aus dieser Stufe entfernen?')) return;
    this.personService.removeFromStufe(person.id, stufeId).subscribe({
      next: (updated) => {
        this.people.update(list => list.map(p => p.id === updated.id ? updated : p));
      },
    });
  }

  unlinkAccount(personId: string): void {
    if (!confirm('Verknüpfung wirklich aufheben?')) return;
    this.personService.unlinkFromAccount(personId).subscribe({
      next: (updated) => {
        this.people.update(list => list.map(p => p.id === updated.id ? updated : p));
      },
    });
  }

  deletePerson(id: string): void {
    if (!confirm('Person wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.')) return;
    this.personService.deletePerson(id).subscribe({
      next: () => this.people.update(list => list.filter(p => p.id !== id)),
    });
  }

  private emptySharedForm() {
    return { firstName: '', lastName: '', nickname: '', email: undefined, phone: undefined, dateOfBirth: undefined };
  }
}
