import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login-error',
  imports: [RouterLink],
  templateUrl: './login-error.html',
  styleUrl: './login-error.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginErrorComponent {
}
