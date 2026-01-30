import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'login-page'
  }
})
export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  errorMessage = signal<string | null>(null);
  isLoading = signal(false);

  constructor() {
    this.route.queryParams.subscribe(params => {
      if (params['error'] === 'oauth_failed') {
        this.errorMessage.set('MiData Anmeldung fehlgeschlagen.');
      } else if (params['error'] === 'oauth_error') {
        this.errorMessage.set('Ein Fehler ist bei der MiData Anmeldung aufgetreten.');
      }
    });
  }

  onMidataLogin() {
    const apiUrl = this.authService.getApiUrl();
    window.location.href = `${apiUrl}/api/oauth/midata/login`;
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const { email, password } = this.loginForm.getRawValue();

    this.authService.login({ email, password }).pipe(
      catchError(() => {
        this.errorMessage.set('Ungültige E-Mail oder Passwort.');
        this.isLoading.set(false);
        return of(null);
      })
    ).subscribe((user) => {
      if (user) {
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin';
        this.router.navigateByUrl(returnUrl);
      }
    });
  }
}
