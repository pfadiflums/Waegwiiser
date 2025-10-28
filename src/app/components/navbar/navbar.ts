import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NavLink } from '../../models/nav-link.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar implements OnInit {
  isMenuOpen = false;
  isScrolled = false;

  navLinks: NavLink[] = [
    { label: 'STUFEN', path: '/stufen' },
    { label: 'ÜBER UNS', path: '/uber-uns' },
    { label: 'BILDER', path: '/bilder' },
    { label: 'DOWNLOADS', path: '/downloads' },
    { label: 'SHOP', path: '/shop' },
    { label: 'PFADIHAUS', path: '/pfadihaus' }
  ];

  ngOnInit(): void {
    this.checkScroll();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.checkScroll();
  }

  checkScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }
}
