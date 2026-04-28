import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StufeService } from '../../../services/stufe.service';
import { LagerService } from '../../../services/lager.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="admin-page">
      <div class="header">
        <div class="title-section">
          <p class="subtitle">Willkommen zurück in der Verwaltung</p>
        </div>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon stufen-icon">⛺</div>
          <div class="stat-info">
             <div class="stat-value">{{ stufenCount() }}</div>
             <div class="stat-label">Stufen</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon lager-icon">🔥</div>
          <div class="stat-info">
             <div class="stat-value">{{ lagerCount() }}</div>
             <div class="stat-label">Lager</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon media-icon">🖼️</div>
          <div class="stat-info">
             <div class="stat-value">Mediathek</div>
             <div class="stat-label">Bilder & Dokumente</div>
          </div>
        </div>
      </div>

      <div class="card quick-actions">
        <div class="card-header">
           <h2>Schnellzugriff</h2>
        </div>
        <div class="actions-grid">
          <a routerLink="/admin/uebungen/new" class="action-btn">
             <span class="icon">📅</span>
             <div class="btn-text">
                <span class="btn-title">Übung planen</span>
                <span class="btn-desc">Erstelle eine neue Aktivität</span>
             </div>
          </a>
          <a routerLink="/admin/lager/new" class="action-btn">
             <span class="icon">🔥</span>
             <div class="btn-text">
                <span class="btn-title">Lager erstellen</span>
                <span class="btn-desc">Neues SoLa oder Weekend</span>
             </div>
          </a>
          <a routerLink="/admin/media" class="action-btn">
             <span class="icon">↑</span>
             <div class="btn-text">
                <span class="btn-title">Datei hochladen</span>
                <span class="btn-desc">Bilder für die Webseite</span>
             </div>
          </a>
        </div>
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
      margin-bottom: 0.5rem;
      .subtitle {
        color: var(--admin-text-muted);
        font-size: 0.875rem;
        letter-spacing: normal;
      }
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.5rem;
    }

    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 0.75rem;
      border: 1px solid var(--admin-border);
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      display: flex;
      align-items: center;
      gap: 1.25rem;

      .stat-icon {
        width: 48px;
        height: 48px;
        border-radius: 0.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;

        &.stufen-icon { background: #fef3c7; }
        &.lager-icon { background: #fee2e2; }
        &.media-icon { background: #e0e7ff; }
      }

      .stat-value {
        font-size: 1.5rem;
        font-weight: 600;
        color: var(--admin-text);
        line-height: 1;
      }

      .stat-label {
        color: var(--admin-text-muted);
        font-size: 0.8125rem;
        font-weight: 500;
        margin-top: 0.25rem;
        letter-spacing: normal;
      }
    }

    .quick-actions {
      background: white;
      border-radius: 0.75rem;
      border: 1px solid var(--admin-border);
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      overflow: hidden;

      .card-header {
        padding: 1.25rem 1.5rem;
        border-bottom: 1px solid var(--admin-border);
        h2 { font-size: 1rem; font-weight: 600; color: var(--admin-text); letter-spacing: normal; }
      }
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1px;
      background: var(--admin-border);
    }

    .action-btn {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.5rem;
      background: white;
      text-decoration: none;
      transition: background 0.2s;

      &:hover { background: #f9fafb; }

      .icon {
        font-size: 1.25rem;
        color: var(--admin-primary);
        background: rgba(99, 102, 241, 0.1);
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 0.375rem;
      }

      .btn-text {
        display: flex;
        flex-direction: column;

        .btn-title { font-weight: 600; color: var(--admin-text); font-size: 0.9375rem; letter-spacing: normal; }
        .btn-desc { font-size: 0.8125rem; color: var(--admin-text-muted); letter-spacing: normal; }
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  private stufeService = inject(StufeService);
  private lagerService = inject(LagerService);

  stufenCount = signal(0);
  lagerCount = signal(0);

  ngOnInit(): void {
    this.stufeService.getAll().subscribe(data => this.stufenCount.set(data.length));
    this.lagerService.getAll().subscribe(data => this.lagerCount.set(data.length));
  }
}
