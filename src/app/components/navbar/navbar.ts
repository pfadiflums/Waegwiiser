import { Component, ChangeDetectionStrategy, signal, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { StufeService } from '../../services/stufe.service';
import { AuthService } from '../../services/auth.service';
import { Stufe } from '../../models/stufe.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive],
})
export class Navbar implements OnInit {
  private stufeService = inject(StufeService);
  private authService = inject(AuthService);

  isMenuOpen = signal(false);
  stufen = signal<Stufe[]>([]);
  isLoggedIn = signal(false);

  ngOnInit(): void {
    this.isLoggedIn.set(this.authService.isAuthenticated());

    this.stufeService.getAll().subscribe({
      next: (data) => this.stufen.set(data),
      error: (err) => console.error('Error loading stufen for navbar', err)
    });
  }
}
