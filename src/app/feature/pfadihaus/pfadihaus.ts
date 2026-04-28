import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-pfadihaus',
  standalone: true,
  templateUrl: './pfadihaus.html',
  styleUrl: './pfadihaus.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PfadihausComponent {}
