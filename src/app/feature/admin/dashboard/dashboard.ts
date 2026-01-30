import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard {
  recentActivities = signal([
    { id: '1', datum: '07.02.2026', motto: 'Waldabenteuer', stufen: 'Wölfe' },
    { id: '2', datum: '14.02.2026', motto: 'Spurensuche', stufen: 'Pfader' },
    { id: '3', datum: '21.02.2026', motto: 'Feuer machen', stufen: 'Biber' },
    { id: '4', datum: '28.02.2026', motto: 'Knotenkunde', stufen: 'Pios' },
  ]);
}
