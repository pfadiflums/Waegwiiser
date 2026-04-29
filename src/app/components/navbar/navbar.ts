import { Component, ChangeDetectionStrategy, signal, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive],
})
export class Navbar implements OnInit {
  private authService = inject(AuthService);

  isMenuOpen = signal(false);
  isLoggedIn = signal(false);

  ngOnInit(): void {
    this.isLoggedIn.set(this.authService.isAuthenticated());
  }
}
