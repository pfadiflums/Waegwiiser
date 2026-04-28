import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet, NavigationEnd } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="admin-layout">
      <aside class="sidebar">
        <div class="sidebar-header">
          <img src="assets/images/logo.svg" alt="Logo" class="logo">
          <span class="app-name">Waegwiiser</span>
        </div>

        <nav class="nav-links">
          <a routerLink="/admin" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
            <span class="icon">📊</span> Dashboard
          </a>
          <a routerLink="/admin/stufen" routerLinkActive="active">
            <span class="icon">⛺</span> Stufen
          </a>
          <a routerLink="/admin/uebungen" routerLinkActive="active">
            <span class="icon">📅</span> Übungen
          </a>
          <a routerLink="/admin/lager" routerLinkActive="active">
            <span class="icon">🔥</span> Lager
          </a>
          <a routerLink="/admin/media" routerLinkActive="active">
            <span class="icon">🖼️</span> Media
          </a>
        </nav>

        <div class="sidebar-footer">
          <div class="user-brief">
             <div class="user-avatar">{{ userInitial() }}</div>
             <div class="user-details">
                <span class="user-role">{{ userRole() }}</span>
             </div>
          </div>
          <button (click)="logout()" class="logout-btn">
            Abmelden
          </button>
        </div>
      </aside>

      <main class="content">
        <header class="content-header">
          <div class="header-left">
             <h1>{{ currentPageTitle() }}</h1>
          </div>
          <div class="header-right">
          </div>
        </header>
        <div class="content-body">
          <router-outlet />
        </div>
      </main>
    </div>
  `,
  styles: [`
    .admin-layout {
      display: flex;
      min-height: 100vh;
      background-color: var(--admin-bg);
      font-family: 'Inter', sans-serif;
    }

    .sidebar {
      width: 280px;
      background: var(--admin-sidebar);
      color: white;
      display: flex;
      flex-direction: column;
      position: fixed;
      height: 100vh;
      border-right: 1px solid rgba(255, 255, 255, 0.05);
      z-index: 100;
    }

    .sidebar-header {
      padding: 2rem 1.5rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;

      .logo {
        height: 32px;
        filter: brightness(0) invert(1);
      }

      .app-name {
        font-weight: 600;
        font-size: 1.25rem;
        letter-spacing: -0.025em;
      }
    }

    .nav-links {
      flex: 1;
      padding: 0.5rem 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;

      a {
        color: #9ca3af;
        text-decoration: none;
        padding: 0.75rem 1rem;
        border-radius: 0.5rem;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        transition: all 0.2s;
        font-size: 0.9375rem;
        font-weight: 500;

        &:hover {
          background: rgba(255, 255, 255, 0.05);
          color: white;
        }

        &.active {
          background: var(--admin-primary);
          color: white;
        }

        .icon {
          font-size: 1.1rem;
          opacity: 0.8;
        }
      }
    }

    .sidebar-footer {
      padding: 1.5rem;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .user-brief {
      display: flex;
      align-items: center;
      gap: 0.75rem;

      .user-avatar {
        width: 32px;
        height: 32px;
        background: var(--admin-primary);
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.875rem;
        font-weight: 600;
      }

      .user-role {
        font-size: 0.75rem;
        color: #9ca3af;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
    }

    .logout-btn {
      width: 100%;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: white;
      padding: 0.625rem;
      border-radius: 0.5rem;
      cursor: pointer;
      font-size: 0.875rem;
      font-weight: 500;
      transition: all 0.2s;

      &:hover {
        background: rgba(255, 255, 255, 0.1);
      }
    }

    .content {
      flex: 1;
      margin-left: 280px;
      display: flex;
      flex-direction: column;
    }

    .content-header {
      height: 72px;
      background: white;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 2.5rem;
      border-bottom: 1px solid var(--admin-border);

      h1 {
        font-size: 1.5rem;
        font-weight: 600;
        letter-spacing: -0.025em;
        color: var(--admin-text);
        margin: 0;
      }
    }

    .content-body {
      padding: 2.5rem;
      flex: 1;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminLayoutComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  userRole = signal(this.authService.getCurrentUserRole());
  userInitial = signal(this.userRole()?.charAt(0) || 'A');

  currentPageTitle = signal('Dashboard');

  constructor() {
    this.updateTitle();
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateTitle();
    });
  }

  private updateTitle(): void {
    const url = this.router.url;
    if (url.includes('/stufen')) this.currentPageTitle.set('Stufen verwalten');
    else if (url.includes('/uebungen')) this.currentPageTitle.set('Übungen verwalten');
    else if (url.includes('/lager')) this.currentPageTitle.set('Lager verwalten');
    else if (url.includes('/media')) this.currentPageTitle.set('Mediathek');
    else this.currentPageTitle.set('Dashboard');
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => this.router.navigate(['/login'])
    });
  }
}
