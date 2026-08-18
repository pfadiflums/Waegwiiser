import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeroDecoration } from '../../../shared/components/hero-decoration/hero-decoration';
import { STUFEN } from '../../../shared/data/stufen';

@Component({
  selector: 'app-home',
  imports: [RouterLink, HeroDecoration],
  templateUrl: './home.html',
})
export class Home {
  protected readonly stufen = STUFEN;
}
