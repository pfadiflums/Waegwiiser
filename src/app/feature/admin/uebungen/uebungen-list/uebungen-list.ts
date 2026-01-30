import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UebungenService } from '../../../../services/uebungen.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Uebungen } from '../../../../models/payload-types/collections/uebungen';
import { Stufen } from '../../../../models/payload-types/collections/stufen';
import { BehaviorSubject, switchMap } from 'rxjs';

@Component({
  selector: 'app-uebungen-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './uebungen-list.html',
  styleUrl: './uebungen-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UebungenListComponent {
  private uebungenService = inject(UebungenService);
  private refresh$ = new BehaviorSubject<void>(undefined);

  uebungen = toSignal(
    this.refresh$.pipe(switchMap(() => this.uebungenService.getUebungen())),
    { initialValue: [] as Uebungen[] }
  );

  getStufeName(stufe: string | Stufen): string {
    if (typeof stufe === 'object' && stufe !== null) {
      return stufe.name || '';
    }
    return stufe as string;
  }

  deleteUebung(id: string) {
    if (confirm('Bist du sicher, dass du diese Übung löschen möchtest?')) {
      this.uebungenService.deleteUebung(id).subscribe(() => {
        this.refresh$.next();
      });
    }
  }

  formatDate(dateString: string): { day: string, month: string } {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('de-CH', { month: 'short' }).toUpperCase();
    return { day, month };
  }
}
