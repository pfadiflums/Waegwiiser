import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StufeService } from '../../../services/stufe.service';
import { Stufe } from '../../../models/stufe.model';

@Component({
  selector: 'app-stufen-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="admin-page">
      <div class="header">
        <div class="title-section">
          <p class="subtitle">Übersicht aller Pfadi-Stufen</p>
        </div>
        <button class="add-btn" routerLink="new">
          <span class="icon">+</span> Neue Stufe
        </button>
      </div>

      <div class="card">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Slug</th>
              <th>Farbe</th>
              <th>Status</th>
              <th class="text-right">Aktionen</th>
            </tr>
          </thead>
          <tbody>
            @for (stufe of stufen(); track stufe.id) {
              <tr>
                <td class="font-medium">{{ stufe.name }}</td>
                <td class="text-muted">{{ stufe.slug }}</td>
                <td>
                  <div class="color-badge" [style.background-color]="stufe.color">
                    {{ stufe.color }}
                  </div>
                </td>
                <td>
                  <span class="status-badge" [class.active]="stufe.isActive">
                    {{ stufe.isActive ? 'Aktiv' : 'Inaktiv' }}
                  </span>
                </td>
                <td class="actions text-right">
                  <a [routerLink]="['edit', stufe.id]" class="edit-link">Bearbeiten</a>
                  <button (click)="deleteStufe(stufe.id)" class="delete-btn">Löschen</button>
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

      .icon {
        font-size: 1.1rem;
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

      tr:last-child td {
        border-bottom: none;
      }

      .font-medium { font-weight: 500; }
      .text-muted { color: var(--admin-text-muted); }
      .text-right { text-align: right; }
    }

    .color-badge {
      padding: 0.2rem 0.6rem;
      border-radius: 0.375rem;
      font-size: 0.75rem;
      font-weight: 600;
      color: white;
      display: inline-block;
      text-shadow: 0 1px 1px rgba(0,0,0,0.1);
    }

    .status-badge {
      padding: 0.2rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 500;
      background: #f3f4f6;
      color: #374151;

      &.active {
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

        &:hover {
          color: #4f46e5;
        }
      }

      .delete-btn {
        background: none;
        border: none;
        color: #ef4444;
        font-weight: 500;
        cursor: pointer;
        padding: 0;
        font-family: inherit;

        &:hover {
          color: #b91c1c;
        }
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StufenListComponent implements OnInit {
  private stufeService = inject(StufeService);

  stufen = signal<Stufe[]>([]);

  ngOnInit(): void {
    this.loadStufen();
  }

  loadStufen(): void {
    this.stufeService.getAll().subscribe(data => this.stufen.set(data));
  }

  deleteStufe(id: string): void {
    if (confirm('Bist du sicher, dass du diese Stufe löschen möchtest?')) {
      this.stufeService.delete(id).subscribe(() => {
        this.loadStufen();
      });
    }
  }
}
