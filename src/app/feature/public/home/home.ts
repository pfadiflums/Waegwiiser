import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StufeStore } from '../../../core/store/stufe.store';
import { HeroDecoration } from '../../../shared/components/hero-decoration/hero-decoration';
import { APP_BG, readableInk } from '../../../shared/utils/color';

@Component({
  selector: 'app-home',
  imports: [RouterLink, HeroDecoration],
  templateUrl: './home.html',
})
export class Home {
  protected readonly stufeStore = inject(StufeStore);

  /**
   * Die Kachelfarbe kommt aus der Datenbank, darum wird die Schriftfarbe je
   * Kachel aus ihrer Luminanz bestimmt statt fest verdrahtet.
   */
  protected readonly stufenTiles = computed(() =>
    this.stufeStore.stufen().map((group) => ({
      ...group,
      ink: readableInk(group.primaryColor ?? APP_BG),
    })),
  );

  constructor() {
    this.stufeStore.loadAll();
  }
}
