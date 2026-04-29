import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, CalendarPlus, Upload, Users, Flag, Image } from 'lucide-angular';
import { STUFEN } from '../../../data/stufen.data';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, LucideAngularModule],
  template: `
    <div class="admin-page">
      <p class="subtitle">Willkommen zurück in der Verwaltung</p>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon" style="background: #fef3c7; color: #d97706;">
            <lucide-icon [img]="Flag" [size]="22"></lucide-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stufenCount }}</div>
            <div class="stat-label">Stufen</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon" style="background: #e0e7ff; color: #4f46e5;">
            <lucide-icon [img]="Image" [size]="22"></lucide-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value stat-link" routerLink="/admin/media">Mediathek</div>
            <div class="stat-label">Bilder & Dokumente</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background: #dcfce7; color: #16a34a;">
            <lucide-icon [img]="Users" [size]="22"></lucide-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value stat-link" routerLink="/admin/users">Benutzer</div>
            <div class="stat-label">Konten verwalten</div>
          </div>
        </div>
      </div>

      <div class="card quick-actions">
        <div class="card-header">
          <h2>Schnellzugriff</h2>
        </div>
        <div class="actions-grid">
          <a routerLink="/admin/uebungen/new" class="action-btn">
            <div class="action-icon">
              <lucide-icon [img]="CalendarPlus" [size]="20"></lucide-icon>
            </div>
            <div class="btn-text">
              <span class="btn-title">Übung planen</span>
              <span class="btn-desc">Erstelle eine neue Aktivität</span>
            </div>
          </a>

          <a routerLink="/admin/media" class="action-btn">
            <div class="action-icon">
              <lucide-icon [img]="Upload" [size]="20"></lucide-icon>
            </div>
            <div class="btn-text">
              <span class="btn-title">Datei hochladen</span>
              <span class="btn-desc">Bilder für die Webseite</span>
            </div>
          </a>
          <a routerLink="/admin/users" class="action-btn">
            <div class="action-icon">
              <lucide-icon [img]="Users" [size]="20"></lucide-icon>
            </div>
            <div class="btn-text">
              <span class="btn-title">Benutzer verwalten</span>
              <span class="btn-desc">Rollen und Konten</span>
            </div>
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-page { display: flex; flex-direction: column; gap: 2rem; }

    .subtitle {
      color: var(--admin-text-muted);
      font-size: 0.875rem;
      letter-spacing: normal;
      margin: 0;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
    }

    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 0.75rem;
      border: 1px solid var(--admin-border);
      box-shadow: 0 1px 2px 0 rgba(0,0,0,0.05);
      display: flex;
      align-items: center;
      gap: 1.25rem;
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .stat-value {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--admin-text);
      line-height: 1;
      letter-spacing: normal;

      &.stat-link {
        font-size: 1rem;
        cursor: pointer;
        &:hover { color: var(--admin-primary); }
      }
    }

    .stat-label {
      color: var(--admin-text-muted);
      font-size: 0.8125rem;
      font-weight: 500;
      margin-top: 0.25rem;
      letter-spacing: normal;
    }

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
      h2 { font-size: 1rem; font-weight: 600; color: var(--admin-text); letter-spacing: normal; margin: 0; }
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
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
    }

    .action-icon {
      color: var(--admin-primary);
      background: rgba(99, 102, 241, 0.08);
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 0.375rem;
      flex-shrink: 0;
    }

    .btn-text {
      display: flex;
      flex-direction: column;
      gap: 0.125rem;

      .btn-title { font-weight: 600; color: var(--admin-text); font-size: 0.9375rem; letter-spacing: normal; }
      .btn-desc { font-size: 0.8125rem; color: var(--admin-text-muted); letter-spacing: normal; }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {

  readonly Flag = Flag;
  readonly Image = Image;
  readonly Users = Users;
  readonly CalendarPlus = CalendarPlus;
  readonly Upload = Upload;

  readonly stufenCount = STUFEN.length;
}
