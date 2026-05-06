import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-impressum',
  standalone: true,
  templateUrl: './impressum.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: []
})
export class ImpressumComponent {}
