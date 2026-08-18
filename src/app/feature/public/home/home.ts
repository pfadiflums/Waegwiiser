import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StufeStore } from '../../../core/store/stufe.store';
import { HeroDecoration } from '../../../shared/components/hero-decoration/hero-decoration';

@Component({
  selector: 'app-home',
  imports: [RouterLink, HeroDecoration],
  templateUrl: './home.html',
})
export class Home {
  protected readonly stufeStore = inject(StufeStore);
  readonly instagramPosts = Array(9).fill(null);

  constructor() {
    this.stufeStore.loadAll();
  }
}
