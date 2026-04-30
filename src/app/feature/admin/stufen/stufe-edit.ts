import { ChangeDetectionStrategy, Component, inject, signal, OnInit, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { StufeService } from '../../../services/stufe.service';
import { CreateStufeRequest, UpdateStufeRequest } from '../../../models/stufe.model';

@Component({
  selector: 'app-stufe-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="admin-page">
      <div class="header">
        <div class="title-section">
          <h1>{{ isEdit() ? 'Stufe bearbeiten' : 'Neue Stufe' }}</h1>
          <a routerLink=".." class="back-link">← Zurück zur Übersicht</a>
        </div>
      </div>

      <div class="card">
        <form [formGroup]="stufeForm" (ngSubmit)="onSubmit()" class="edit-form">
          <div class="form-grid">
            <div class="form-group">
              <label for="name">Name</label>
              <input id="name" type="text" formControlName="name" placeholder="z.B. Wolfsstufe">
            </div>

            <div class="form-group">
              <label for="slug">Slug</label>
              <input id="slug" type="text" formControlName="slug" placeholder="z.B. woelfe">
            </div>

            <div class="form-group">
              <label for="color">Farbe</label>
              <div class="color-picker-wrapper">
                <input id="color" type="color" formControlName="color">
                <span class="color-value">{{ stufeForm.get('color')?.value }}</span>
              </div>
            </div>

            <div class="form-group">
              <label for="sortOrder">Sortierung</label>
              <input id="sortOrder" type="number" formControlName="sortOrder">
            </div>
          </div>

          <div class="form-group">
            <label for="slogan">Slogan</label>
            <input id="slogan" type="text" formControlName="slogan" placeholder="Kurzer Slogan der Stufe">
          </div>

          <div class="form-group">
            <label for="beschreibung">Beschreibung</label>
            <textarea id="beschreibung" formControlName="beschreibung" rows="5" placeholder="Detaillierte Beschreibung der Stufe..."></textarea>
          </div>

          <div class="form-group">
            <label for="calendarUrl">Google Kalender URL</label>
            <input id="calendarUrl" type="url" formControlName="calendarUrl" placeholder="https://calendar.google.com/calendar/embed?src=...">
          </div>

          <div class="form-group checkbox" *ngIf="isEdit()">
            <input type="checkbox" id="isActive" formControlName="isActive">
            <label for="isActive" class="checkbox-label">Stufe ist öffentlich sichtbar</label>
          </div>

          <div class="form-actions">
            <button type="button" routerLink=".." class="cancel-btn">Abbrechen</button>
            <button type="submit" class="save-btn" [disabled]="stufeForm.invalid || isLoading()">
              {{ isLoading() ? 'Speichert...' : 'Änderungen speichern' }}
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

      input[type="text"],
      input[type="number"],
      textarea {
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

    .color-picker-wrapper {
      display: flex;
      align-items: center;
      gap: 1rem;

      input[type="color"] {
        -webkit-appearance: none;
        border: 1px solid var(--admin-border);
        border-radius: 0.375rem;
        width: 48px;
        height: 38px;
        cursor: pointer;
        padding: 4px;
        background: white;
        &::-webkit-color-swatch-wrapper { padding: 0; }
        &::-webkit-color-swatch { border: none; border-radius: 0.25rem; }
      }

      .color-value {
        font-family: monospace;
        font-size: 0.875rem;
        color: var(--admin-text-muted);
      }
    }

    .checkbox {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem;
      background: #f9fafb;
      border-radius: 0.5rem;

      input[type="checkbox"] {
        width: 1rem;
        height: 1rem;
        cursor: pointer;
      }

      .checkbox-label {
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--admin-text);
        cursor: pointer;
        text-transform: none;
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
export class StufeEditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private stufeService = inject(StufeService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  id = input<string>();
  isEdit = signal(false);
  isLoading = signal(false);

  stufeForm = this.fb.group({
    name: ['', [Validators.required]],
    slug: ['', [Validators.required]],
    slogan: [''],
    beschreibung: [''],
    color: ['#000000'],
    calendarUrl: [''],
    sortOrder: [0, [Validators.required]],
    isActive: [true]
  });

  ngOnInit(): void {
    const stufeId = this.route.snapshot.params['id'];
    if (stufeId) {
      this.isEdit.set(true);
      this.loadStufe(stufeId);
    }
  }

  loadStufe(id: string): void {
    this.stufeService.getAll().subscribe(stufen => {
      const stufe = stufen.find(s => s.id === id);
      if (stufe) {
        this.stufeForm.patchValue({
          name: stufe.name,
          slug: stufe.slug,
          slogan: stufe.slogan,
          beschreibung: stufe.beschreibung,
          color: stufe.color,
          calendarUrl: stufe.calendarUrl ?? '',
          sortOrder: stufe.sortOrder,
          isActive: stufe.isActive
        });
      }
    });
  }

  onSubmit(): void {
    if (this.stufeForm.invalid) return;

    this.isLoading.set(true);
    const formValue = this.stufeForm.getRawValue();

    if (this.isEdit()) {
      const updateReq: UpdateStufeRequest = {
        name: formValue.name!,
        slug: formValue.slug!,
        slogan: formValue.slogan || undefined,
        beschreibung: formValue.beschreibung || undefined,
        color: formValue.color || undefined,
        calendarUrl: formValue.calendarUrl || undefined,
        sortOrder: formValue.sortOrder!,
        isActive: formValue.isActive!
      };
      this.stufeService.update(this.route.snapshot.params['id'], updateReq).subscribe({
        next: () => this.router.navigate(['/admin/stufen']),
        error: () => this.isLoading.set(false)
      });
    } else {
      const createReq: CreateStufeRequest = {
        name: formValue.name!,
        slug: formValue.slug!,
        slogan: formValue.slogan || undefined,
        beschreibung: formValue.beschreibung || undefined,
        color: formValue.color || undefined,
        calendarUrl: formValue.calendarUrl || undefined,
        sortOrder: formValue.sortOrder!
      };
      this.stufeService.create(createReq).subscribe({
        next: () => this.router.navigate(['/admin/stufen']),
        error: () => this.isLoading.set(false)
      });
    }
  }
}
