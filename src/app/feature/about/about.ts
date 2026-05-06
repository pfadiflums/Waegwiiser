import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-about',
  standalone: true,
  templateUrl: './about.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
  ]
})
export class AboutComponent {}
