import { ChangeDetectionStrategy, Component, computed, inject, input, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StufeService } from '../../services/stufe.service';
import { UebungService } from '../../services/uebung.service';
import { LeaderResponse } from '../../models/stufe.model';
import { Uebung } from '../../models/uebung.model';
import { MediaService } from '../../services/media.service';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { STUFEN_BY_SLUG } from '../../data/stufen.data';

@Component({
  selector: 'app-stufe-detail',
  imports: [CommonModule],
  templateUrl: './stufe-detail.html',
  styleUrl: './stufe-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StufeDetailComponent {
  private stufeService = inject(StufeService);
  private uebungService = inject(UebungService);
  public mediaService = inject(MediaService);

  slug = input.required<string>();

  config = computed(() => STUFEN_BY_SLUG[this.slug()] ?? null);

  beschreibung = signal<string | null>(null);
  stammLeiter = signal<LeaderResponse[]>([]);
  nextUebung = signal<Uebung | null>(null);
  isLoading = signal(true);
  error = signal<string | null>(null);

  constructor() {
    effect(() => {
      const currentSlug = this.slug();
      if (!STUFEN_BY_SLUG[currentSlug]) {
        this.error.set('Stufe nicht gefunden.');
        this.isLoading.set(false);
        return;
      }
      this.loadData(currentSlug);
    });
  }

  private loadData(slug: string) {
    this.isLoading.set(true);
    this.error.set(null);

    forkJoin({
      stufe: this.stufeService.getBySlug(slug),
      nextUebung: this.uebungService.getNextForStufe(slug).pipe(catchError(() => of(null))),
    }).subscribe({
      next: ({ stufe, nextUebung }) => {
        this.beschreibung.set(stufe.beschreibung);
        this.stammLeiter.set(stufe.stammLeiter);
        this.nextUebung.set(nextUebung);
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('Fehler beim Laden der Daten.');
        this.isLoading.set(false);
      }
    });
  }
}
