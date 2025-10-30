import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NavItem } from '../../models/navitem.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive],
})
export class Navbar {
  navItems: NavItem[] = [
    { label: 'Stufen', path: '/stufen' },
    { label: 'ÜBER UNS', path: '/ueber-uns' },
    { label: 'BILDER', path: '/bilder' },
    { label: 'Downloads', path: '/downloads' },
    { label: 'Shop', path: '/shop' },
    { label: 'Pfadihaus', path: '/pfadihaus' }
  ];
}
