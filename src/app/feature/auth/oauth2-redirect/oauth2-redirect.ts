import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthStore } from '../../../store/auth.store';

@Component({
  selector: 'app-oauth2-redirect',
  template: `
    <div class="min-h-screen flex items-center justify-center bg-[#f9fafb] font-[Inter,sans-serif] text-sm text-[#6b7280]">
      Anmeldung wird verarbeitet...
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OAuth2RedirectComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly authStore = inject(AuthStore);

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (token) {
      this.authStore.initFromOAuth(token);
    } else {
      this.authStore.handleUnauthorized();
    }
  }
}
