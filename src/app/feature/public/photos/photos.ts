import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-photos',
  standalone: true,
  templateUrl: './photos.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotosComponent {

}
