import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-datenschutz',
  standalone: true,
  templateUrl: './datenschutz.html',
  styleUrl: './datenschutz.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: []
})
export class DatenschutzComponent {}
