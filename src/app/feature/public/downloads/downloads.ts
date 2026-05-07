import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-downloads',
  standalone: true,
  templateUrl: './downloads.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DownloadsComponent {

}
