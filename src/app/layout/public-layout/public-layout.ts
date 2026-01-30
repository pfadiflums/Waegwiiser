import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from '../../components/navbar/navbar';
import { AdminBarComponent } from '../../components/admin-bar/admin-bar';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-public-layout',
  imports: [RouterOutlet, Navbar, AdminBarComponent],
  template: `
    @if (authService.isAuthenticated()) {
      <app-admin-bar />
    }
    <app-navbar />
    <main>
      <router-outlet />
    </main>
    <footer>
    </footer>
  `,
  styles: [`
    main {
      min-height: calc(100vh - 80px); /* Adjust based on navbar height */
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicLayoutComponent {
  public authService = inject(AuthService);
}
