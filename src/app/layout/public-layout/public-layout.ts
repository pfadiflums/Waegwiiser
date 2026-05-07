import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from '../../components/navbar/navbar';
import { Footer } from '../../components/footer/footer';

@Component({
  selector: 'app-public-layout',
  imports: [RouterOutlet, Navbar, Footer],
  template: `
    <app-navbar />
    <main>
      <router-outlet />
    </main>
    <app-footer />
  `,
  styles: [`
    main {
      min-height: calc(100vh - 80px);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicLayout {
}
