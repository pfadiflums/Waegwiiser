import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-shop',
  standalone: true,
  templateUrl: './shop.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShopComponent {

}
