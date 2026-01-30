import { ChangeDetectionStrategy, Component, inject, computed, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ProfileModalComponent } from '../../feature/admin/profile-modal/profile-modal';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ProfileModalComponent],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminLayoutComponent {
  public authService = inject(AuthService);
  private router = inject(Router);

  showProfileModal = signal(false);

  activeViewTitle = computed(() => {
    const url = this.router.url;
    if (url.includes('/admin/uebungen')) return 'Übungen';
    if (url.includes('/admin/leitende')) return 'Leitende';
    if (url.includes('/admin/downloads')) return 'Downloads';
    return 'Dashboard';
  });

  logout() {
    this.authService.logout().subscribe();
  }
}
