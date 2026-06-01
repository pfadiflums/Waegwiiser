import { ChangeDetectionStrategy, Component, ViewEncapsulation, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  tablerBox,
  tablerCalendar,
  tablerCalendarEvent,
  tablerCampfire,
  tablerCompass,
  tablerCreditCard,
  tablerDashboard,
  tablerDots,
  tablerDotsVertical,
  tablerFileText,
  tablerFolder,
  tablerHeart,
  tablerHelp,
  tablerLogout,
  tablerNotification,
  tablerPhoto,
  tablerSearch,
  tablerSettings,
  tablerShare3,
  tablerStack2,
  tablerTrash,
  tablerUserCircle,
  tablerUsers,
  tablerUsersGroup,
} from '@ng-icons/tabler-icons';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { AuthStore } from '../../core/store/auth.store';

@Component({
  selector: 'app-admin-shell',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    NgIcon,
    HlmSidebarImports,
    HlmIconImports,
    HlmButtonImports,
    HlmDropdownMenuImports,
    HlmAvatarImports,
  ],
  providers: [
    provideIcons({
      tablerCampfire,
      tablerDashboard,
      tablerStack2,
      tablerCalendar,
      tablerUsers,
      tablerCalendarEvent,
      tablerUsersGroup,
      tablerHeart,
      tablerCompass,
      tablerBox,
      tablerPhoto,
      tablerFileText,
      tablerFolder,
      tablerSettings,
      tablerHelp,
      tablerSearch,
      tablerDots,
      tablerShare3,
      tablerTrash,
      tablerDotsVertical,
      tablerUserCircle,
      tablerCreditCard,
      tablerNotification,
      tablerLogout,
    }),
  ],
  encapsulation: ViewEncapsulation.None,
  styles: [`
    [hlmSidebarWrapper] {
      --sidebar-width: calc(var(--spacing) * 64);
      --header-height: calc(var(--spacing) * 12 + 1px);
    }
  `],
  templateUrl: './admin-shell.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminShell {
  protected readonly authStore = inject(AuthStore);

  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  protected readonly pageTitle = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      startWith(null),
      map(() => {
        let route = this.activatedRoute;
        while (route.firstChild) route = route.firstChild;
        return (route.snapshot.data['title'] as string | undefined) ?? 'Dashboard';
      }),
    ),
    { initialValue: 'Dashboard' },
  );

  protected readonly navMain = [
    { title: 'Dashboard', route: '/admin', icon: 'tablerDashboard', exact: true },
  ];

  protected readonly bereiche = [
    { name: 'Übungen', route: '/admin/uebungen', icon: 'tablerCalendar'},
    { name: 'Fotos', route: '/admin/fotos', icon: 'tablerPhoto' },
    { name: 'Dokumente', route: '/admin/dokumente', icon: 'tablerFileText' },
    { name: 'Stufen', route: '/admin/stufen', icon: 'tablerStack2' },

  ];

  protected readonly navSecondary = [
    { title: 'Einstellungen', route: '/admin/settings', icon: 'tablerSettings' },
    { title: 'Hilfe', route: '/admin/help', icon: 'tablerHelp' },
    { title: 'Suchen', route: '/admin/search', icon: 'tablerSearch' },
  ];

  protected get userInitials(): string {
    const user = this.authStore.user();
    const name = user?.pfadiName ?? user?.email ?? '?';
    return name.slice(0, 2).toUpperCase();
  }

  protected get displayName(): string {
    return this.authStore.user()?.pfadiName
      ?? this.authStore.user()?.email?.split('@')[0]
      ?? '—';
  }

  logout(): void {
    this.authStore.logout();
  }
}
