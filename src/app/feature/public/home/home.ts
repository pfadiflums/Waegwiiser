import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StufeStore } from '../../../core/store/stufe.store';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  protected readonly stufeStore = inject(StufeStore);
  readonly instagramPosts = Array(9).fill(null);

  constructor() {
    this.stufeStore.loadAll();
  }
}
