import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { LagerService } from '../../../services/lager.service';
import { StufeService } from '../../../services/stufe.service';
import { Stufe } from '../../../models/stufe.model';
import { CreateLagerRequest, UpdateLagerRequest, LagerType, LagerStatus } from '../../../models/lager.model';

@Component({
  selector: 'app-lager-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="admin-page">
      <div class="header">
        <div class="title-section">
          <h1>{{ isEdit() ? 'Lager bearbeiten' : 'Neues Lager' }}</h1>
          <a routerLink=".." class="back-link">← Zurück zur Übersicht</a>
        </div>
      </div>

      <div class="card">
        <form [formGroup]="lagerForm" (ngSubmit)="onSubmit()" class="edit-form">
          <div class="form-grid">
            <div class="form-group">
              <label for="name">Name</label>
              <input id="name" type="text" formControlName="name" placeholder="z.B. Sommerlager 2026">
            </div>

            <div class="form-group">
              <label for="slug">Slug</label>
              <input id="slug" type="text" formControlName="slug" placeholder="z.B. sola-2026">
            </div>

            <div class="form-group">
              <label for="lagerType">Lager Typ</label>
              <select id="lagerType" formControlName="lagerType">
                <option value="SOLA">SoLa (Sommerlager)</option>
                <option value="WOLA">WoLa (Winterlager)</option>
                <option value="PFILA">PfiLa (Pfingstlager)</option>
                <option value="KALA">KaLa (Kantonallager)</option>
                <option value="WEEKEND">Weekend</option>
                <option value="OTHER">Andere</option>
              </select>
            </div>

            <div class="form-group">
              <label for="status">Status</label>
              <select id="status" formControlName="status">
                <option value="DRAFT">Entwurf</option>
                <option value="PUBLISHED">Veröffentlicht</option>
                <option value="REGISTRATION_OPEN">Anmeldung offen</option>
                <option value="REGISTRATION_CLOSED">Anmeldung geschlossen</option>
                <option value="COMPLETED">Abgeschlossen</option>
                <option value="CANCELLED">Abgesagt</option>
              </select>
            </div>

            <div class="form-group">
              <label for="startDatum">Start Datum</label>
              <input id="startDatum" type="date" formControlName="startDatum">
            </div>

            <div class="form-group">
              <label for="endDatum">End Datum</label>
              <input id="endDatum" type="date" formControlName="endDatum">
            </div>

            <div class="form-group">
              <label for="location">Ort</label>
              <input id="location" type="text" formControlName="location" placeholder="z.B. Lenk im Simmental">
            </div>

            <div class="form-group">
              <label for="kosten">Kosten (CHF)</label>
              <input id="kosten" type="number" formControlName="kosten">
            </div>
          </div>

          <div class="form-group">
            <label for="beschreibung">Beschreibung</label>
            <textarea id="beschreibung" formControlName="beschreibung" rows="5" placeholder="Details zum Lager..."></textarea>
          </div>

          <div class="form-group">
            <label>Beteiligte Stufen</label>
            <div class="checkbox-group">
              @for (stufe of stufen(); track stufe.id) {
                <label class="checkbox-item">
                  <input type="checkbox" [checked]="isStufeSelected(stufe.id)" (change)="toggleStufe(stufe.id)">
                  <span class="checkbox-label">{{ stufe.name }}</span>
                </label>
              }
            </div>
          </div>

          <div class="form-actions">
            <button type="button" routerLink=".." class="cancel-btn">Abbrechen</button>
            <button type="submit" class="save-btn" [disabled]="lagerForm.invalid || isLoading()">
              {{ isLoading() ? 'Speichert...' : 'Lager speichern' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .admin-page {
      max-width: 900px;
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .header {
      .title-section h1 {
        font-size: 1.5rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
        color: var(--admin-text);
      }
    }

    .back-link {
      color: var(--admin-text-muted);
      text-decoration: none;
      font-size: 0.875rem;
      &:hover { color: var(--admin-primary); }
    }

    .card {
      background: white;
      padding: 2.5rem;
      border-radius: 0.75rem;
      border: 1px solid var(--admin-border);
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    }

    .edit-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;

      label {
        font-size: 0.8125rem;
        font-weight: 600;
        color: var(--admin-text);
      }

      input,
      textarea,
      select {
        padding: 0.625rem 0.875rem;
        border: 1px solid var(--admin-border);
        border-radius: 0.5rem;
        font-family: inherit;
        font-size: 0.875rem;
        color: var(--admin-text);
        transition: all 0.2s;

        &:focus {
          outline: none;
          border-color: var(--admin-primary);
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }
        &::placeholder { color: #9ca3af; }
      }
    }

    .checkbox-group {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 1rem;
      padding: 1.25rem;
      background: #f9fafb;
      border-radius: 0.5rem;
      border: 1px solid var(--admin-border);
    }

    .checkbox-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      cursor: pointer;

      input[type="checkbox"] {
        width: 1rem;
        height: 1rem;
        cursor: pointer;
      }

      .checkbox-label {
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--admin-text);
      }
    }

    .form-actions {
      margin-top: 1rem;
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--admin-border);
    }

    .save-btn {
      padding: 0.625rem 1.5rem;
      background: var(--admin-primary);
      color: white;
      border: none;
      border-radius: 0.5rem;
      font-weight: 500;
      font-size: 0.875rem;
      cursor: pointer;
      transition: background 0.2s;
      &:disabled { opacity: 0.5; cursor: not-allowed; }
      &:hover:not(:disabled) { background: #4f46e5; }
    }

    .cancel-btn {
      padding: 0.625rem 1.5rem;
      background: white;
      color: var(--admin-text);
      border: 1px solid var(--admin-border);
      border-radius: 0.5rem;
      font-weight: 500;
      font-size: 0.875rem;
      cursor: pointer;
      &:hover { background: #f9fafb; }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LagerEditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private lagerService = inject(LagerService);
  private stufeService = inject(StufeService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isEdit = signal(false);
  isLoading = signal(false);
  stufen = signal<Stufe[]>([]);
  selectedStufeIds = signal<string[]>([]);

  lagerForm = this.fb.group({
    name: ['', [Validators.required]],
    slug: ['', [Validators.required]],
    lagerType: ['SOLA' as LagerType, [Validators.required]],
    status: ['DRAFT' as LagerStatus],
    startDatum: ['', [Validators.required]],
    endDatum: ['', [Validators.required]],
    location: [''],
    kosten: [0],
    beschreibung: [''],
  });

  ngOnInit(): void {
    this.stufeService.getAll().subscribe(data => this.stufen.set(data));

    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEdit.set(true);
      this.loadLager(id);
    }
  }

  loadLager(id: string): void {
    this.lagerService.getAll().subscribe(list => {
      const lager = list.find(l => l.id === id);
      if (lager) {
        this.lagerForm.patchValue({
          name: lager.name,
          slug: lager.slug,
          lagerType: lager.lagerType,
          status: lager.status,
          startDatum: lager.startDatum,
          endDatum: lager.endDatum,
          location: lager.location,
          kosten: lager.kosten,
          beschreibung: lager.beschreibung
        });
        this.selectedStufeIds.set(lager.stufeIds);
      }
    });
  }

  toggleStufe(id: string): void {
    const current = this.selectedStufeIds();
    if (current.includes(id)) {
      this.selectedStufeIds.set(current.filter(i => i !== id));
    } else {
      this.selectedStufeIds.set([...current, id]);
    }
  }

  isStufeSelected(id: string): boolean {
    return this.selectedStufeIds().includes(id);
  }

  onSubmit(): void {
    if (this.lagerForm.invalid) return;

    this.isLoading.set(true);
    const formValue = this.lagerForm.getRawValue();

    const baseData = {
      name: formValue.name!,
      slug: formValue.slug!,
      lagerType: formValue.lagerType!,
      beschreibung: formValue.beschreibung || undefined,
      startDatum: formValue.startDatum!,
      endDatum: formValue.endDatum!,
      location: formValue.location || undefined,
      kosten: formValue.kosten || undefined,
      stufeIds: this.selectedStufeIds()
    };

    if (this.isEdit()) {
      const updateReq: UpdateLagerRequest = {
        ...baseData,
        status: formValue.status as LagerStatus
      };
      this.lagerService.update(this.route.snapshot.params['id'], updateReq).subscribe({
        next: () => this.router.navigate(['/admin/lager']),
        error: () => this.isLoading.set(false)
      });
    } else {
      const createReq: CreateLagerRequest = baseData;
      this.lagerService.create(createReq).subscribe({
        next: () => this.router.navigate(['/admin/lager']),
        error: () => this.isLoading.set(false)
      });
    }
  }
}
