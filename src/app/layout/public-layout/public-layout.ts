import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from '../../shared/components/navbar/navbar';
import { Footer } from '../../shared/components/footer/footer';

@Component({
  selector: 'app-public-layout',
  imports: [RouterOutlet, Navbar, Footer],
  template: `
    <div class="public-app">
      <a
        href="#inhalt"
        class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-1000 focus:rounded-lg focus:bg-dark focus:px-5 focus:py-3 focus:text-app-bg focus:font-bold focus:no-underline"
      >
        Zum Inhalt springen
      </a>
      <app-navbar />
      <main id="inhalt" tabindex="-1">
        <router-outlet />
      </main>
      <app-footer />
    </div>
  `,
})
export class PublicLayout {
}
