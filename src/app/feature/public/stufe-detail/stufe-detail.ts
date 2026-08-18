import { Component, OnInit, computed, inject, input, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DomSanitizer, SafeResourceUrl, Title } from '@angular/platform-browser';
import { Api } from '../../../api/api';
import { getBySlug } from '../../../api/fn/stufen/get-by-slug';
import { StufeDetailDto } from '../../../api/models/stufe-detail-dto';
import { LocalTime } from '../../../api/models/local-time';
import { APP_BG, INK_DARK, ensureReadable } from '../../../shared/utils/color';

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
  protected readonly error = signal<string | null>(null);

  readonly calendarUrl = computed<SafeResourceUrl>(() => {
    const url = this.stufe()?.googleCalendarIframeUrl;
    return url ? this.sanitizer.bypassSecurityTrustResourceUrl(url) : '';
  });

  /**
   * Die Stufenfarbe wird im Admin frei gesetzt und erreicht als Schriftfarbe
   * auf dem hellen Hintergrund nicht immer AA (Biber 1.59:1, Pfader 2.73:1).
   * Sie wird darum so weit abgedunkelt, bis 4.5:1 erreicht sind.
   */
  protected readonly headingColor = computed(() =>
    ensureReadable(this.stufe()?.primaryColor ?? INK_DARK, APP_BG),
  );

  ngOnInit(): void {
    this.api.invoke$Response(getBySlug, { slug: this.slug() }).then(
      response => {
        this.stufe.set(response.body);
        this.isLoading.set(false);
        if (response.body?.name) {
          this.title.setTitle(`${response.body.name} · Pfadi St. Justus Flums`);
        }
      },
      () => {
        this.error.set('Fehler beim Laden der Stufe.');
        this.isLoading.set(false);
      },
    );
  }

  protected formatTime(t: LocalTime | undefined): string {
    if (!t) return '';
    const h = String(t.hour ?? 0).padStart(2, '0');
    const m = String(t.minute ?? 0).padStart(2, '0');
    return `${h}:${m}`;
  }
}
