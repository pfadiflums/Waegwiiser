import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgOptimizedImage } from '@angular/common';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { AuthStore } from '../../../core/store/auth.store';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    NgOptimizedImage,
    HlmCardImports,
    HlmInputImports,
    HlmLabelImports,
    HlmButtonImports,
    HlmAlertImports,
    HlmSeparatorImports,
  ],
  templateUrl: './login.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  protected readonly authStore = inject(AuthStore);

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  protected get emailControl() {
    return this.loginForm.controls.email;
  }

  protected get passwordControl() {
    return this.loginForm.controls.password;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;
    this.authStore.clearError();
    this.authStore.login(this.loginForm.getRawValue());
  }

  loginWithMidata(): void {
    window.location.href = environment.midataAuthUrl;
  }
}
