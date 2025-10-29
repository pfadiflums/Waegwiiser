import { Component, signal, effect, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { NavLink } from '../../models/nav-link.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, NgOptimizedImage],
  host: {
    '(window:scroll)': 'onWindowScroll()',
    '(window:keydown.escape)': 'onEscapeKey()'
  }
})
export class Navbar {
  isMenuOpen = signal(false);
  isScrolled = signal(false);

  navLinks: NavLink[] = [
    { label: 'STUFEN', path: '/stufen' },
    { label: 'ÜBER UNS', path: '/uber-uns' },
    { label: 'BILDER', path: '/bilder' },
    { label: 'DOWNLOADS', path: '/downloads' },
    { label: 'SHOP', path: '/shop' },
    { label: 'PFADIHAUS', path: '/pfadihaus' }
  ];

  constructor() {
    this.checkScroll();

    effect(() => {
      if (this.isMenuOpen()) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });
  }

  onWindowScroll(): void {
    this.checkScroll();
  }

  onEscapeKey(): void {
    if (this.isMenuOpen()) {
      this.closeMenu();
    }
  }

  checkScroll(): void {
    this.isScrolled.set(window.scrollY > 50);
  }

  toggleMenu(): void {
    this.isMenuOpen.update(open => !open);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }
}
