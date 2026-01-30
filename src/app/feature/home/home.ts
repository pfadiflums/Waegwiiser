import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { Stufe } from '../../models/stufe.model';

@Component({
  selector: 'app-home',
  imports: [RouterLink, NgOptimizedImage],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  scoutGroups = signal<Stufe[]>([
    {
      name: 'Biber',
      color: '#EAC04A',
      slug: 'biber',
      motto: '',
      description: '',
      ageRange: '',
    },
    {
      name: 'Wölfe',
      color: '#1380A3',
      slug: 'woelfe',
      motto: '',
      description: '',
      ageRange: '',
    },
    {
      name: 'Pfader',
      color: '#B78E60',
      slug: 'pfader',
      motto: '',
      description: '',
      ageRange: '',
    },
    {
      name: 'Pios',
      color: '#BF2E26',
      slug: 'pios',
      motto: '',
      description: '',
      ageRange: '',
    },
  ]);

  instagramPosts = signal<any[]>(Array(9).fill(null));
}
