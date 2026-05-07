import { Component, ChangeDetectionStrategy, signal, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgClass } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, NgClass],
})
export class Navbar implements OnInit {
  private authService = inject(AuthService);

  isMenuOpen = signal(false);
  isLoggedIn = signal(false);

  readonly navLinks = [
    { path: '/home', label: 'Home' },
    { path: '/about', label: 'Über uns' },
    { path: '/photos', label: 'Bilder' },
    { path: '/downloads', label: 'Downloads' },
    { path: '/shop', label: 'Shop' },
    { path: '/pfadihaus', label: 'Pfadihaus' },
  ];

  ngOnInit(): void {
    this.isLoggedIn.set(this.authService.isAuthenticated());
  }
}
