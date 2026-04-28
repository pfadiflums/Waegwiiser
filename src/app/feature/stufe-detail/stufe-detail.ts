import { ChangeDetectionStrategy, Component, inject, input, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StufeService } from '../../services/stufe.service';
import { UebungService } from '../../services/uebung.service';
import { Stufe } from '../../models/stufe.model';
import { Uebung } from '../../models/uebung.model';
import { MediaService } from '../../services/media.service';

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

  // Route param input
  slug = input.required<string>();

  stufe = signal<Stufe | null>(null);
  nextUebung = signal<Uebung | null>(null);
  isLoading = signal(true);
  error = signal<string | null>(null);

  constructor() {
    effect(() => {
      const currentSlug = this.slug();
      if (currentSlug) {
        this.loadData(currentSlug);
      }
    });
  }

  private loadData(slug: string) {
    this.isLoading.set(true);
    this.stufeService.getBySlug(slug).subscribe({
      next: (stufe) => {
        if (stufe) {
          this.stufe.set(stufe);
          this.loadNextUebung(slug);
        } else {
          this.error.set('Stufe nicht gefunden.');
          this.isLoading.set(false);
        }
      },
      error: () => {
        this.error.set('Fehler beim Laden der Stufe.');
        this.isLoading.set(false);
      }
    });
  }

  private loadNextUebung(stufeSlug: string) {
    this.uebungService.getNextForStufe(stufeSlug).subscribe({
      next: (uebung) => {
        this.nextUebung.set(uebung);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }
}
