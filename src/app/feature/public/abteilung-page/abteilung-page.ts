import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AbteilungPageContent } from './abteilung-page.model';
import { HeroDecoration } from '../../../shared/components/hero-decoration/hero-decoration';

@Component({
  selector: 'app-abteilung-page',
  imports: [HeroDecoration],
  templateUrl: './abteilung-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AbteilungPageComponent {
  readonly content = input.required<AbteilungPageContent>();
}
