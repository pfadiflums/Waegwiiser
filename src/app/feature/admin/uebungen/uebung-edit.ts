import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { UebungService } from '../../../services/uebung.service';
import { StufeService } from '../../../services/stufe.service';
import { Stufe } from '../../../models/stufe.model';
import { CreateUebungRequest, UpdateUebungRequest } from '../../../models/uebung.model';

@Component({
  selector: 'app-uebung-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="admin-page">
      <div class="header">
        <div class="title-section">
          <h1>{{ isEdit() ? 'Übung bearbeiten' : 'Neue Übung' }}</h1>
          <a routerLink=".." class="back-link">← Zurück zur Übersicht</a>
        </div>
      </div>

      <div class="card">
        <form [formGroup]="uebungForm" (ngSubmit)="onSubmit()" class="edit-form">
          <div class="form-grid">
            <div class="form-group">
              <label for="stufeId">Stufe</label>
              <select id="stufeId" formControlName="stufeId" [attr.disabled]="isEdit() ? true : null">
                <option value="">Wähle eine Stufe...</option>
                @for (s of stufen(); track s.id) {
                  <option [value]="s.id">{{ s.name }}</option>
                }
              </select>
            </div>

            <div class="form-group">
              <label for="datum">Datum</label>
              <input id="datum" type="date" formControlName="datum">
            </div>

            <div class="form-group">
              <label for="antretenZeit">Antreten Zeit</label>
              <input id="antretenZeit" type="time" formControlName="antretenZeit">
            </div>

            <div class="form-group">
              <label for="antretenOrt">Antreten Ort</label>
              <input id="antretenOrt" type="text" formControlName="antretenOrt" placeholder="z.B. Pfadihaus">
            </div>

            <div class="form-group">
              <label for="abtretenZeit">Abtreten Zeit</label>
              <input id="abtretenZeit" type="time" formControlName="abtretenZeit">
            </div>

            <div class="form-group">
              <label for="abtretenOrt">Abtreten Ort</label>
              <input id="abtretenOrt" type="text" formControlName="abtretenOrt" placeholder="z.B. Pfadihaus">
            </div>
          </div>

          <div class="form-group">
            <label for="motto">Motto</label>
            <input id="motto" type="text" formControlName="motto" placeholder="z.B. Feuer & Flamme">
          </div>

          <div class="form-group">
            <label for="tenue">Tenue</label>
            <input id="tenue" type="text" formControlName="tenue" placeholder="z.B. Wetterentsprechende Kleidung, Krawatte">
          </div>

          <div class="form-group">
            <label for="mitnehmen">Mitnehmen</label>
            <textarea id="mitnehmen" formControlName="mitnehmen" rows="3" placeholder="z.B. Z'Trinken, SBB..."></textarea>
          </div>

          <div class="form-group">
            <label for="weiteres">Weiteres</label>
            <textarea id="weiteres" formControlName="weiteres" rows="3" placeholder="z.B. Abmeldung bis Freitag bei..."></textarea>
          </div>

          <div class="form-group">
            <label for="status">Veröffentlichungsstatus</label>
            <select id="status" formControlName="status">
              <option value="DRAFT">Entwurf (Nur Admin)</option>
              <option value="PUBLISHED">Veröffentlicht (Öffentlich)</option>
              <option value="CANCELLED">Abgesagt</option>
            </select>
          </div>

          <div class="form-actions">
            <button type="button" routerLink=".." class="cancel-btn">Abbrechen</button>
            <button type="submit" class="save-btn" [disabled]="uebungForm.invalid || isLoading()">
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

        &:disabled {
          background: #f9fafb;
          cursor: not-allowed;
          color: var(--admin-text-muted);
        }
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
export class UebungEditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private uebungService = inject(UebungService);
  private stufeService = inject(StufeService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isEdit = signal(false);
  isLoading = signal(false);
  stufen = signal<Stufe[]>([]);

  uebungForm = this.fb.group({
    stufeId: ['', [Validators.required]],
    datum: ['', [Validators.required]],
    antretenZeit: [''],
    antretenOrt: [''],
    abtretenZeit: [''],
    abtretenOrt: [''],
    motto: [''],
    tenue: [''],
    mitnehmen: [''],
    weiteres: [''],
    status: ['DRAFT']
  });

  ngOnInit(): void {
    this.stufeService.getAll().subscribe(data => this.stufen.set(data));

    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEdit.set(true);
      this.loadUebung(id);
    }
  }

  loadUebung(id: string): void {
    // We need to find the uebung. Since we don't have a getById,
    // we'll fetch from all (a bit inefficient but works for now)
    this.stufeService.getAll().subscribe(stufen => {
      stufen.forEach(stufe => {
        this.stufeService.getUebungen(stufe.slug).subscribe(response => {
          const uebung = response.items.find(u => u.id === id);
          if (uebung) {
            this.uebungForm.patchValue({
              stufeId: uebung.stufeId,
              datum: uebung.datum,
              antretenZeit: uebung.antretenZeit ? uebung.antretenZeit.slice(0,5) : '',
              antretenOrt: uebung.antretenOrt,
              abtretenZeit: uebung.abtretenZeit ? uebung.abtretenZeit.slice(0,5) : '',
              abtretenOrt: uebung.abtretenOrt,
              motto: uebung.motto,
              tenue: uebung.tenue,
              mitnehmen: uebung.mitnehmen,
              weiteres: uebung.weiteres,
              status: uebung.status
            });
          }
        });
      });
    });
  }

  onSubmit(): void {
    if (this.uebungForm.invalid) return;

    this.isLoading.set(true);
    const formValue = this.uebungForm.getRawValue();

    if (this.isEdit()) {
      const updateReq: UpdateUebungRequest = {
        datum: formValue.datum!,
        antretenZeit: formValue.antretenZeit ? formValue.antretenZeit + ':00' : undefined,
        antretenOrt: formValue.antretenOrt || undefined,
        abtretenZeit: formValue.abtretenZeit ? formValue.abtretenZeit + ':00' : undefined,
        abtretenOrt: formValue.abtretenOrt || undefined,
        motto: formValue.motto || undefined,
        tenue: formValue.tenue || undefined,
        mitnehmen: formValue.mitnehmen || undefined,
        weiteres: formValue.weiteres || undefined,
        status: formValue.status as any
      };
      this.uebungService.update(this.route.snapshot.params['id'], updateReq).subscribe({
        next: () => this.router.navigate(['/admin/uebungen']),
        error: () => this.isLoading.set(false)
      });
    } else {
      const createReq: CreateUebungRequest = {
        stufeId: formValue.stufeId!,
        datum: formValue.datum!,
        antretenZeit: formValue.antretenZeit ? formValue.antretenZeit + ':00' : undefined,
        antretenOrt: formValue.antretenOrt || undefined,
        abtretenZeit: formValue.abtretenZeit ? formValue.abtretenZeit + ':00' : undefined,
        abtretenOrt: formValue.abtretenOrt || undefined,
        motto: formValue.motto || undefined,
        tenue: formValue.tenue || undefined,
        mitnehmen: formValue.mitnehmen || undefined,
        weiteres: formValue.weiteres || undefined,
        status: (formValue.status as any) || 'DRAFT'
      };
      this.uebungService.create(createReq).subscribe({
        next: () => this.router.navigate(['/admin/uebungen']),
        error: () => this.isLoading.set(false)
      });
    }
  }
}
