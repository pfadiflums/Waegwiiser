import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-login',
  imports: [NgOptimizedImage, HlmCardImports, HlmButtonImports],
  templateUrl: './login.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  loginWithMidata(): void {
    window.location.href = environment.midataAuthUrl;
  }
}
