import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPasswordComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);

  token: string | null = null;

  resetForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  status = signal<'idle' | 'loading' | 'success' | 'error' | 'invalid_token'>('idle');
  errorMessage = signal<string | null>(null);

  ngOnInit() {
    this.token = this.route.snapshot.queryParams['token'];
    if (!this.token) {
      this.status.set('invalid_token');
    }
  }

  onSubmit() {
    if (this.resetForm.invalid || !this.token) {
      this.resetForm.markAllAsTouched();
      return;
    }

    this.status.set('loading');
    this.errorMessage.set(null);

    const { email, password } = this.resetForm.getRawValue();

    this.authService.resetPassword({ email, password, token: this.token }).pipe(
      catchError((err) => {
        this.status.set('error');
        this.errorMessage.set(err.error?.errors?.[0]?.message || 'Ein Fehler ist aufgetreten. Der Link ist möglicherweise abgelaufen.');
        this.status.set('idle');
        return of(null);
      })
    ).subscribe((res) => {
      if (res) {
        this.status.set('success');
      }
    });
  }
}
