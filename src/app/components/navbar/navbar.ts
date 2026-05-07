import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgClass } from '@angular/common';
import { AuthStore } from '../../store/auth.store';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, NgClass],
})
export class Navbar {
  protected readonly authStore = inject(AuthStore);

  isMenuOpen = signal(false);

  readonly navLinks = [
    { path: '/home', label: 'Home' },
    { path: '/about', label: 'Über uns' },
    { path: '/photos', label: 'Bilder' },
    { path: '/downloads', label: 'Downloads' },
    { path: '/shop', label: 'Shop' },
    { path: '/pfadihaus', label: 'Pfadihaus' },
  ];
}
