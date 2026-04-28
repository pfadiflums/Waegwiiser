import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-join',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './join.html',
  styleUrl: './join.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JoinComponent {

}
