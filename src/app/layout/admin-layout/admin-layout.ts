import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet, NavigationEnd } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { filter } from 'rxjs/operators';
import {
  LucideAngularModule,
  LayoutDashboard,
  Flag,
  CalendarDays,
  Image,
  Users,
  Settings,
  LogOut,
} from 'lucide-angular';

const PAGE_TITLES: Record<string, string> = {
  '/admin/stufen': 'Stufen verwalten',
  '/admin/uebungen': 'Übungen verwalten',

  '/admin/media': 'Mediathek',
  '/admin/users': 'Benutzerverwaltung',
  '/admin/account': 'Mein Konto',
  '/admin': 'Dashboard',
};

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, LucideAngularModule],
  template: `
    <div class="admin-layout">
      <aside class="sidebar">
        <div class="sidebar-header">
          <img src="assets/images/logo.svg" alt="Logo" class="logo">
          <span class="app-name">Waegwiiser</span>
        </div>

        <nav class="nav-links">
          <a routerLink="/admin" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
            <lucide-icon [img]="LayoutDashboard" [size]="18"></lucide-icon>
            Dashboard
          </a>
          <a routerLink="/admin/stufen" routerLinkActive="active">
            <lucide-icon [img]="Flag" [size]="18"></lucide-icon>
            Stufen
          </a>
          <a routerLink="/admin/uebungen" routerLinkActive="active">
            <lucide-icon [img]="CalendarDays" [size]="18"></lucide-icon>
            Übungen
          </a>

          <a routerLink="/admin/media" routerLinkActive="active">
            <lucide-icon [img]="Image" [size]="18"></lucide-icon>
            Media
          </a>

          <div class="nav-divider"></div>

          <a routerLink="/admin/users" routerLinkActive="active">
            <lucide-icon [img]="Users" [size]="18"></lucide-icon>
            Benutzer
          </a>
        </nav>

        <div class="sidebar-footer">
          <a routerLink="/admin/account" class="user-brief" routerLinkActive="user-brief--active">
            <div class="user-avatar">{{ userInitial() }}</div>
            <div class="user-details">
              <span class="user-name">{{ userName() }}</span>
              <span class="user-role">{{ userRole() }}</span>
            </div>
            <lucide-icon [img]="Settings" [size]="16" class="settings-icon"></lucide-icon>
          </a>
          <button (click)="logout()" class="logout-btn">
            <lucide-icon [img]="LogOut" [size]="16"></lucide-icon>
            Abmelden
          </button>
        </div>
      </aside>

      <main class="content">
        <header class="content-header">
          <h1>{{ currentPageTitle() }}</h1>
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
      width: 260px;
      background: var(--admin-sidebar);
      color: white;
      display: flex;
      flex-direction: column;
      position: fixed;
      height: 100vh;
      border-right: 1px solid rgba(255,255,255,0.05);
      z-index: 100;
    }

    .sidebar-header {
      padding: 1.75rem 1.5rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      border-bottom: 1px solid rgba(255,255,255,0.05);

      .logo {
        height: 28px;
        filter: brightness(0) invert(1);
      }

      .app-name {
        font-weight: 600;
        font-size: 1.125rem;
        letter-spacing: -0.025em;
      }
    }

    .nav-links {
      flex: 1;
      padding: 1rem 0.75rem;
      display: flex;
      flex-direction: column;
      gap: 0.125rem;
      overflow-y: auto;

      a {
        color: #9ca3af;
        text-decoration: none;
        padding: 0.625rem 0.875rem;
        border-radius: 0.5rem;
        display: flex;
        align-items: center;
        gap: 0.625rem;
        transition: all 0.15s;
        font-size: 0.9rem;
        font-weight: 500;
        letter-spacing: normal;

        lucide-icon { flex-shrink: 0; opacity: 0.7; }

        &:hover {
          background: rgba(255,255,255,0.06);
          color: white;
          lucide-icon { opacity: 1; }
        }

        &.active {
          background: rgba(99, 102, 241, 0.2);
          color: white;
          lucide-icon { opacity: 1; }
        }
      }
    }

    .nav-divider {
      height: 1px;
      background: rgba(255,255,255,0.07);
      margin: 0.5rem 0.875rem;
    }

    .sidebar-footer {
      padding: 1rem 0.75rem;
      border-top: 1px solid rgba(255,255,255,0.05);
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .user-brief {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.625rem 0.875rem;
      border-radius: 0.5rem;
      text-decoration: none;
      transition: background 0.15s;
      cursor: pointer;

      &:hover, &.user-brief--active {
        background: rgba(255,255,255,0.06);
      }

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
        flex-shrink: 0;
      }

      .user-details {
        flex: 1;
        display: flex;
        flex-direction: column;
        min-width: 0;
      }

      .user-name {
        font-size: 0.875rem;
        font-weight: 500;
        color: white;
        letter-spacing: normal;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .user-role {
        font-size: 0.6875rem;
        color: #9ca3af;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .settings-icon {
        color: #9ca3af;
        flex-shrink: 0;
      }
    }

    .logout-btn {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
      color: #9ca3af;
      padding: 0.5rem;
      border-radius: 0.5rem;
      cursor: pointer;
      font-size: 0.875rem;
      font-weight: 500;
      font-family: inherit;
      letter-spacing: normal;
      transition: all 0.15s;

      &:hover {
        background: rgba(255,255,255,0.08);
        color: white;
      }
    }

    .content {
      flex: 1;
      margin-left: 260px;
      display: flex;
      flex-direction: column;
    }

    .content-header {
      height: 64px;
      background: white;
      display: flex;
      align-items: center;
      padding: 0 2.5rem;
      border-bottom: 1px solid var(--admin-border);
      position: sticky;
      top: 0;
      z-index: 10;

      h1 {
        font-size: 1.25rem;
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
export class AdminLayoutComponent implements OnInit {
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private router = inject(Router);

  readonly LayoutDashboard = LayoutDashboard;
  readonly Flag = Flag;
  readonly CalendarDays = CalendarDays;

  readonly Image = Image;
  readonly Users = Users;
  readonly Settings = Settings;
  readonly LogOut = LogOut;

  userRole = signal(this.authService.getCurrentUserRole() ?? '');
  userInitial = signal('A');
  userName = signal('');
  currentPageTitle = signal('Dashboard');

  constructor() {
    this.updateTitle();
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => this.updateTitle());
  }

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe({
      next: (u) => {
        this.userName.set(u.firstName ? `${u.firstName} ${u.lastName}` : u.username);
        this.userInitial.set((u.firstName || u.username || 'A').charAt(0).toUpperCase());
        this.userRole.set(u.role);
      },
    });
  }

  private updateTitle(): void {
    const url = this.router.url.split('?')[0];
    const match = Object.keys(PAGE_TITLES)
      .sort((a, b) => b.length - a.length)
      .find(key => url.startsWith(key));
    this.currentPageTitle.set(match ? PAGE_TITLES[match] : 'Dashboard');
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => this.router.navigate(['/login']),
    });
  }
}
