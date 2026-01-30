import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from '../../components/navbar/navbar';

@Component({
  selector: 'app-public-layout',
  imports: [RouterOutlet, Navbar],
  template: `
    <app-navbar />
    <main>
      <router-outlet />
    </main>
    <footer>
    </footer>
  `,
  styles: [`
    main {
      min-height: calc(100vh - 80px); /* Adjust based on navbar height */
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicLayoutComponent {}
