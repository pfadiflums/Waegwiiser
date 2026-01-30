import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-bar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-bar.html',
  styleUrl: './admin-bar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminBarComponent {
  public authService = inject(AuthService);

  logout() {
    this.authService.logout().subscribe();
  }
}
