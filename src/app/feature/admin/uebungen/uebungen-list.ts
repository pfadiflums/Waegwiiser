import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UebungService } from '../../../services/uebung.service';
import { StufeService } from '../../../services/stufe.service';
import { Uebung } from '../../../models/uebung.model';
import { Stufe } from '../../../models/stufe.model';

@Component({
  selector: 'app-uebungen-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="admin-page">
      <div class="header">
        <div class="title-section">
          <p class="subtitle">Verwalte wöchentliche Aktivitäten</p>
        </div>
        <button class="add-btn" routerLink="new">
          <span class="icon">+</span> Neue Übung
        </button>
      </div>

      <div class="filters card">
        <div class="filter-group">
          <label for="stufeFilter">Stufe filtern</label>
          <select id="stufeFilter" (change)="onStufeChange($event)">
            <option value="">Alle Stufen</option>
            @for (s of stufen(); track s.id) {
              <option [value]="s.slug">{{ s.name }}</option>
            }
          </select>
        </div>
      </div>

      <div class="card">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Datum</th>
              <th>Motto</th>
              <th>Stufe</th>
              <th>Status</th>
              <th class="text-right">Aktionen</th>
            </tr>
          </thead>
          <tbody>
            @for (uebung of filteredUebungen(); track uebung.id) {
              <tr>
                <td class="font-medium">{{ uebung.datum | date:'dd.MM.yyyy' }}</td>
                <td>{{ uebung.motto || '-' }}</td>
                <td>
                   <span class="stufe-tag">{{ getStufeName(uebung.stufeId) }}</span>
                </td>
                <td>
                  <span class="status-badge" [class.published]="uebung.status === 'PUBLISHED'">
                    {{ uebung.status }}
                  </span>
                </td>
                <td class="actions text-right">
                  <a [routerLink]="['edit', uebung.id]" class="edit-link">Bearbeiten</a>
                  <button (click)="deleteUebung(uebung.id)" class="delete-btn">Löschen</button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .admin-page {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 0.5rem;

      .subtitle {
        color: var(--admin-text-muted);
        font-size: 0.875rem;
        margin-top: 0.25rem;
        letter-spacing: normal;
      }
    }

    .add-btn {
      padding: 0.625rem 1.25rem;
      background: var(--admin-primary);
      color: white;
      border: none;
      border-radius: 0.5rem;
      font-weight: 500;
      font-size: 0.875rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: background 0.2s;

      &:hover {
        background: #4f46e5;
      }

      .icon { font-size: 1.1rem; }
    }

    .filters {
      padding: 1.25rem 1.5rem;
      background: white;

      .filter-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        max-width: 240px;

        label {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--admin-text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        select {
          padding: 0.5rem 0.75rem;
          border: 1px solid var(--admin-border);
          border-radius: 0.5rem;
          font-family: inherit;
          font-size: 0.875rem;
          color: var(--admin-text);
          &:focus {
            outline: none;
            border-color: var(--admin-primary);
          }
        }
      }
    }

    .card {
      background: white;
      border-radius: 0.75rem;
      border: 1px solid var(--admin-border);
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      overflow: hidden;
    }

    .admin-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;

      th {
        padding: 0.875rem 1.5rem;
        background: #f9fafb;
        font-weight: 600;
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--admin-text-muted);
        border-bottom: 1px solid var(--admin-border);
      }

      td {
        padding: 1.25rem 1.5rem;
        border-bottom: 1px solid var(--admin-border);
        font-size: 0.875rem;
        color: var(--admin-text);
      }

      tr:last-child td { border-bottom: none; }

      .font-medium { font-weight: 500; }
      .text-right { text-align: right; }
    }

    .stufe-tag {
      padding: 0.2rem 0.6rem;
      background: #f3f4f6;
      border-radius: 0.375rem;
      font-size: 0.75rem;
      font-weight: 500;
      color: #374151;
    }

    .status-badge {
      padding: 0.2rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 500;
      background: #fef3c7;
      color: #92400e;

      &.published {
        background: #ecfdf5;
        color: #065f46;
      }
    }

    .actions {
      display: flex;
      gap: 1.25rem;
      justify-content: flex-end;

      .edit-link {
        color: var(--admin-primary);
        text-decoration: none;
        font-weight: 500;
        &:hover { color: #4f46e5; }
      }

      .delete-btn {
        background: none;
        border: none;
        color: #ef4444;
        font-weight: 500;
        cursor: pointer;
        padding: 0;
        font-family: inherit;
        &:hover { color: #b91c1c; }
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UebungenListComponent implements OnInit {
  private uebungService = inject(UebungService);
  private stufeService = inject(StufeService);

  stufen = signal<Stufe[]>([]);
  allUebungen = signal<Uebung[]>([]);
  selectedStufeSlug = signal<string>('');

  filteredUebungen = signal<Uebung[]>([]);

  ngOnInit(): void {
    this.stufeService.getAll().subscribe(data => {
      this.stufen.set(data);
      this.loadAllUebungen();
    });
  }

  loadAllUebungen(): void {
    this.filteredUebungen.set([]);
    this.stufen().forEach(stufe => {
      this.stufeService.getUebungen(stufe.slug).subscribe(response => {
        const current = this.allUebungen();
        this.allUebungen.set([...current, ...response.items]);
        this.updateFiltered();
      });
    });
  }

  onStufeChange(event: any): void {
    this.selectedStufeSlug.set(event.target.value);
    this.updateFiltered();
  }

  updateFiltered(): void {
    const slug = this.selectedStufeSlug();
    if (!slug) {
      this.filteredUebungen.set(this.allUebungen().sort((a,b) => b.datum.localeCompare(a.datum)));
    } else {
      const stufe = this.stufen().find(s => s.slug === slug);
      if (stufe) {
        this.filteredUebungen.set(
          this.allUebungen().filter(u => u.stufeId === stufe.id).sort((a,b) => b.datum.localeCompare(a.datum))
        );
      }
    }
  }

  getStufeName(id: string): string {
    return this.stufen().find(s => s.id === id)?.name || 'Unbekannt';
  }

  deleteUebung(id: string): void {
    if (confirm('Bist du sicher?')) {
      this.uebungService.delete(id).subscribe(() => {
        this.allUebungen.set(this.allUebungen().filter(u => u.id !== id));
        this.updateFiltered();
      });
    }
  }
}
