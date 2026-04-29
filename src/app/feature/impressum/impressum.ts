import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-impressum',
  standalone: true,
  templateUrl: './impressum.html',
  styleUrl: './impressum.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: []
})
export class ImpressumComponent {}
