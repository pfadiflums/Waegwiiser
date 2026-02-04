import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login-success',
  imports: [],
  templateUrl: './login-success.html',
  styleUrl: './login-success.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginSuccessComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);

  ngOnInit() {
    const token = this.route.snapshot.queryParams['token'];

    if (token) {
      this.authService.setToken(token);
    }

    // me() will check cookies for the token we just set (or existing one)
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
