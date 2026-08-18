import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgClass } from '@angular/common';
import { AuthStore } from '../../../core/store/auth.store';

export interface NavLink {
  label: string;
  path?: string;
  children?: { path: string; label: string }[];
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, NgClass],
})
export class Navbar {
  protected readonly authStore = inject(AuthStore);

  readonly isMenuOpen = signal(false);
  readonly openDropdown = signal<string | null>(null);

  readonly navLinks: NavLink[] = [
    { path: '/home', label: 'Home' },
    {
      label: 'Abteilung',
      children: [
        { path: '/abteilung/abteilungsleitung', label: 'Abteilungsleitung' },
        { path: '/abteilung/abteilungskomitee', label: 'Abteilungskomitee' },
        { path: '/abteilung/altpfader', label: 'Altpfader' },
      ],
    },
    { path: '/photos', label: 'Bilder' },
    { path: '/downloads', label: 'Downloads' },
    { path: '/shop', label: 'Shop' },
    { path: '/pfadihaus', label: 'Pfadihaus' },
  ];

  toggleDropdown(label: string): void {
    this.openDropdown.update((current) => (current === label ? null : label));
  }

  closeDropdown(): void {
    this.openDropdown.set(null);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
    this.openDropdown.set(null);
  }

  toggleMenu(): void {
    this.isMenuOpen.update((open) => !open);
    this.openDropdown.set(null);
  }
}
