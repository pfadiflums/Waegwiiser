import { ChangeDetectionStrategy, Component, computed, inject, input, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { StufeService } from '../../services/stufe.service';
import { LeaderResponse } from '../../models/stufe.model';
import { Uebung } from '../../models/uebung.model';
import { MediaService } from '../../services/media.service';
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
  private sanitizer = inject(DomSanitizer);
  public mediaService = inject(MediaService);

  slug = input.required<string>();

  config = computed(() => STUFEN_BY_SLUG[this.slug()] ?? null);

  calendarUrl = computed<SafeResourceUrl>(() => {
    const cfg = this.config();
    return cfg ? this.sanitizer.bypassSecurityTrustResourceUrl(cfg.calendarUrl) : '';
  });

  beschreibung = signal<string | null>(null);
  stammLeiter = signal<LeaderResponse[]>([]);
  teamMembers = signal<LeaderResponse[]>([]);
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

    this.stufeService.getBySlug(slug).subscribe({
      next: (stufe) => {
        this.beschreibung.set(stufe.beschreibung);
        this.stammLeiter.set(stufe.stammLeiter);

        this.teamMembers.set([...stufe.stammLeiter]);

        this.nextUebung.set(stufe.nextUebung);
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('Fehler beim Laden der Daten.');
        this.isLoading.set(false);
      }
    });
  }
}
