import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  forgotForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });

  status = signal<'idle' | 'loading' | 'success' | 'error'>('idle');
  errorMessage = signal<string | null>(null);

  onSubmit() {
    if (this.forgotForm.invalid) {
      this.forgotForm.markAllAsTouched();
      return;
    }

    this.status.set('loading');
    this.errorMessage.set(null);

    this.authService.forgotPassword(this.forgotForm.getRawValue().email).pipe(
      catchError(() => {
        this.status.set('error');
        this.errorMessage.set('Es ist ein Fehler aufgetreten. Bitte versuche es später erneut.');
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
