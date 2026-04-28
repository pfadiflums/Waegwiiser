import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-oauth2-redirect',
  standalone: true,
  template: '<div class="loading">Anmeldung wird verarbeitet...</div>',
  styles: [`
    .loading {
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Inter', sans-serif;
      font-size: 1rem;
      color: #6b7280;
      background: #f9fafb;
    }
  `]
})
export class OAuth2RedirectComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (token) {
        localStorage.setItem('jwt_token', token);
        // After storing token, fetch user info to get role
        this.authService.getCurrentUser().subscribe({
          next: (user) => {
            localStorage.setItem('user_role', user.role);
            this.router.navigate(['/admin']);
          },
          error: () => {
            this.router.navigate(['/login'], { queryParams: { error: 'auth_failed' } });
          }
        });
      } else {
        this.router.navigate(['/login'], { queryParams: { error: 'no_token' } });
      }
    });
  }
}
