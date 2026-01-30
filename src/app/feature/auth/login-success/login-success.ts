import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login-success',
  template: `
    <div class="success-wrapper">
      <div class="success-content">
        <div class="spinner"></div>
        <p>Anmeldung erfolgreich. Du wirst weitergeleitet...</p>
      </div>
    </div>
  `,
  styles: [`
    .success-wrapper {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #F8FAFC;
    }
    .success-content {
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
    }
    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid rgba(27, 67, 50, 0.1);
      border-top-color: #1B4332;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    p {
      color: #64748B;
      font-weight: 500;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginSuccessComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);

  ngOnInit() {
    const token = this.route.snapshot.queryParams['token'];

    if (token) {
      localStorage.setItem('payload-token', token);
    }

    // me() will check localStorage for the token we just set (or existing one)
    this.authService.me().subscribe({
      next: (user) => {
        if (user) {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/login'], { queryParams: { error: 'oauth_failed' } });
        }
      },
      error: () => {
        this.router.navigate(['/login'], { queryParams: { error: 'oauth_error' } });
      }
    });
  }
}
