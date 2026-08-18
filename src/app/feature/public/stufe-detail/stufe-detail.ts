import { Component, OnInit, computed, inject, input, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DomSanitizer, SafeResourceUrl, Title } from '@angular/platform-browser';
import { Api } from '../../../api/api';
import { getBySlug } from '../../../api/fn/stufen/get-by-slug';
import { StufeDetailDto } from '../../../api/models/stufe-detail-dto';
import { LocalTime } from '../../../api/models/local-time';
import { STUFE_PLACEHOLDER_DESCRIPTION, findStufe } from '../../../shared/data/stufen';

@Component({
  selector: 'app-stufe-detail',
  imports: [DatePipe],
  templateUrl: './stufe-detail.html',
})
export class StufeDetailComponent implements OnInit {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly api = inject(Api);
  private readonly title = inject(Title);

  slug = input.required<string>();

  protected readonly stufe = signal<StufeDetailDto | null>(null);
  protected readonly isLoading = signal(true);

  readonly calendarUrl = computed<SafeResourceUrl>(() => {
    const url = this.stufe()?.googleCalendarIframeUrl;
    return url ? this.sanitizer.bypassSecurityTrustResourceUrl(url) : '';
  });

  ngOnInit(): void {
    void this.load();
  }

  /**
   * Laedt die Stufe. Schlaegt das fehl oder ist die Antwort leer, wird die
   * Seite trotzdem gerendert — mit dem Namen aus der festen Stufen-Liste,
   * einem Platzhaltertext und leeren Tabellen statt einer Fehlermeldung.
   */
  private async load(): Promise<void> {
    let loaded: StufeDetailDto | null = null;
    try {
      const response = await this.api.invoke$Response(getBySlug, { slug: this.slug() });
      loaded = response.body ?? null;
    } catch {
      loaded = null;
    }

    this.stufe.set(loaded ?? this.buildPlaceholder());
    this.isLoading.set(false);

    const name = this.stufe()?.name;
    if (name) {
      this.title.setTitle(`${name} · Pfadi St. Justus Flums`);
    }
  }

  /** Platzhalter aus der festen Stufen-Liste, oder null bei unbekanntem Slug. */
  private buildPlaceholder(): StufeDetailDto | null {
    const known = findStufe(this.slug());
    if (!known) return null;

    return {
      slug: known.slug,
      name: known.name,
      primaryColor: known.primaryColor,
      description: STUFE_PLACEHOLDER_DESCRIPTION,
      leitungsteam: [],
    };
  }

  protected formatTime(t: LocalTime | undefined): string {
    if (!t) return '';
    const h = String(t.hour ?? 0).padStart(2, '0');
    const m = String(t.minute ?? 0).padStart(2, '0');
    return `${h}:${m}`;
  }
}
