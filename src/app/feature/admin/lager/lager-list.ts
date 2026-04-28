import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LagerService } from '../../../services/lager.service';
import { Lager } from '../../../models/lager.model';

@Component({
  selector: 'app-lager-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="admin-page">
      <div class="header">
        <div class="title-section">
          <p class="subtitle">Übersicht aller Lager und Weekends</p>
        </div>
        <button class="add-btn" routerLink="new">
          <span class="icon">+</span> Neues Lager
        </button>
      </div>

      <div class="card">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Typ</th>
              <th>Zeitraum</th>
              <th>Status</th>
              <th class="text-right">Aktionen</th>
            </tr>
          </thead>
          <tbody>
            @for (lager of lagerList(); track lager.id) {
              <tr>
                <td class="font-medium">{{ lager.name }}</td>
                <td>
                  <span class="type-tag">{{ lager.lagerType }}</span>
                </td>
                <td class="text-muted">
                  {{ lager.startDatum | date:'dd.MM' }} - {{ lager.endDatum | date:'dd.MM.yyyy' }}
                </td>
                <td>
                  <span class="status-badge" [class.open]="lager.status === 'REGISTRATION_OPEN'">
                    {{ getStatusLabel(lager.status) }}
                  </span>
                </td>
                <td class="actions text-right">
                  <a [routerLink]="['edit', lager.id]" class="edit-link">Bearbeiten</a>
                  <button (click)="deleteLager(lager.id)" class="delete-btn">Löschen</button>
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
      &:hover { background: #4f46e5; }
      .icon { font-size: 1.1rem; }
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
      .text-muted { color: var(--admin-text-muted); }
      .text-right { text-align: right; }
    }

    .type-tag {
      padding: 0.2rem 0.5rem;
      background: #e0e7ff;
      color: #4338ca;
      border-radius: 0.375rem;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .status-badge {
      padding: 0.2rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 500;
      background: #f3f4f6;
      color: #374151;

      &.open {
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
export class LagerListComponent implements OnInit {
  private lagerService = inject(LagerService);

  lagerList = signal<Lager[]>([]);

  ngOnInit(): void {
    this.loadLager();
  }

  loadLager(): void {
    this.lagerService.getAll().subscribe(data => this.lagerList.set(data));
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      'DRAFT': 'Entwurf',
      'PUBLISHED': 'Veröffentlicht',
      'REGISTRATION_OPEN': 'Anmeldung offen',
      'REGISTRATION_CLOSED': 'Anmeldung zu',
      'COMPLETED': 'Beendet',
      'CANCELLED': 'Abgesagt'
    };
    return labels[status] || status;
  }

  deleteLager(id: string): void {
    if (confirm('Bist du sicher?')) {
      this.lagerService.delete(id).subscribe(() => {
        this.loadLager();
      });
    }
  }
}
