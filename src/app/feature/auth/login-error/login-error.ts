import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login-error',
  imports: [RouterLink],
  template: `
    <div class="error-wrapper">
      <div class="error-card">
        <div class="error-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
        </div>
        <h1>Anmeldung fehlgeschlagen</h1>
        <p>Es gab ein Problem bei der Anmeldung mit MiData. Bitte versuche es erneut.</p>
        <button routerLink="/login" class="btn-primary">Zurück zum Login</button>
      </div>
    </div>
  `,
  styles: [`
    .error-wrapper {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #F8FAFC;
      padding: 1rem;
    }
    .error-card {
      max-width: 400px;
      width: 100%;
      background: white;
      padding: 2.5rem;
      border-radius: 12px;
      text-align: center;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
      border: 1px solid #E2E8F0;
    }
    .error-icon {
      width: 64px;
      height: 64px;
      background: #FEF2F2;
      color: #EF4444;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem;
    }
    h1 {
      font-size: 1.25rem;
      font-weight: 700;
      color: #0F172A;
      margin-bottom: 0.75rem;
    }
    p {
      color: #64748B;
      font-size: 0.875rem;
      margin-bottom: 2rem;
      line-height: 1.5;
    }
    .btn-primary {
      display: inline-block;
      width: 100%;
      padding: 0.75rem;
      background-color: #1B4332;
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      text-decoration: none;
      transition: background-color 0.2s;
    }
    .btn-primary:hover {
      background-color: #2d6a4f;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginErrorComponent {
}
