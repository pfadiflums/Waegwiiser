import { Component } from '@angular/core';
import { Stufe } from '../../models/stufe.model';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  scoutGroups: Stufe[] = [
    {
      name: 'Biber', color: '#EAC04A',
      slug: '',
      motto: '',
      description: '',
      ageRange: ''
    },
    {
      name: 'Wölfe', color: '#1380A3',
      slug: '',
      motto: '',
      description: '',
      ageRange: ''
    },
    {
      name: 'Pfader', color: '#B78E60',
      slug: '',
      motto: '',
      description: '',
      ageRange: ''
    },
    {
      name: 'Pios', color: '#BF2E26',
      slug: '',
      motto: '',
      description: '',
      ageRange: ''
    }
  ];

  instagramPosts = Array(9).fill(null);
}
