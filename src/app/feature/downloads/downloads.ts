import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-downloads',
  standalone: true,
  templateUrl: './downloads.html',
  styleUrl: './downloads.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DownloadsComponent {

}
