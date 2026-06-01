import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthStore } from '../../../core/store/auth.store';

@Component({
  selector: 'app-oauth2-redirect',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen flex items-center justify-center bg-[#f9fafb]">
      <p class="font-mono text-sm text-gray-500">Anmeldung wird verarbeitet…</p>
    </div>
  `,
})
export class OAuth2RedirectComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly authStore = inject(AuthStore);

  ngOnInit(): void {
    const params = this.route.snapshot.queryParamMap;
    const token = params.get('token')
      ?? new URLSearchParams(window.location.hash.replace(/^#/, '')).get('token');

    if (token) {
      this.authStore.initFromOAuth(token);
    } else {
      this.authStore.initFromCookie();
    }
  }
}
