import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'register-page'
  }
})
export class Register implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  token: string | null = null;

  status = signal<'checking' | 'valid' | 'invalid' | 'registering' | 'success'>('checking');
  errorMessage = signal<string | null>(null);
  isAuthenticated = this.authService.isAuthenticated;

  registerForm = this.fb.nonNullable.group({
    pfadiname: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  }, {
    validators: (group) => {
      const pass = group.get('password')?.value;
      const confirmPass = group.get('confirmPassword')?.value;
      return pass === confirmPass ? null : { notSame: true };
    }
  });

  ngOnInit() {
    this.token = this.route.snapshot.queryParams['token'];

    if (!this.token) {
      this.status.set('invalid');
      this.errorMessage.set('Kein Einladungs-Token gefunden. Du benötigst einen Link von einem Administrator.');
      return;
    }

    this.validateToken();
  }

  private validateToken() {
    if (!this.token) return;

    this.authService.validateInviteToken(this.token).pipe(
      catchError(() => {
        this.status.set('invalid');
        this.errorMessage.set('Fehler bei der Validierung der Einladung.');
        return of({ docs: [] });
      })
    ).subscribe((res) => {
      if (res && res.docs && res.docs.length > 0) {
        const invite = res.docs[0];
        this.status.set('valid');
        this.registerForm.patchValue({ email: invite.email });
        this.registerForm.get('email')?.disable();
      } else {
        this.status.set('invalid');
        this.errorMessage.set('Dieser Einladungs-Link ist ungültig oder bereits abgelaufen.');
      }
    });
  }

  onSubmit() {
    if (this.registerForm.invalid || !this.token) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.status.set('registering');
    this.errorMessage.set(null);

    const { pfadiname, email, password } = this.registerForm.getRawValue();

    this.authService.register({
      pfadiname,
      email,
      password,
      inviteToken: this.token
    }).pipe(
      catchError((err) => {
        this.status.set('valid');
        this.errorMessage.set(err.error?.errors?.[0]?.message || 'Registrierung fehlgeschlagen. Bitte versuche es erneut.');
        return of(null);
      })
    ).subscribe((res) => {
      if (res) {
        this.status.set('success');
        if (this.authService.isAuthenticated()) {
          setTimeout(() => {
            this.router.navigate(['/admin']);
          }, 2000);
        }
      }
    });
  }
}
