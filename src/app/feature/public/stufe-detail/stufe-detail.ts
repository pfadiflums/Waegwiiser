import { ChangeDetectionStrategy, Component, OnInit, computed, inject, input, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Api } from '../../../api/api';
import { getBySlug } from '../../../api/fn/stufen/get-by-slug';
import { StufeDetailDto } from '../../../api/models/stufe-detail-dto';
import { LocalTime } from '../../../api/models/local-time';

@Component({
  selector: 'app-stufe-detail',
  imports: [DatePipe],
  templateUrl: './stufe-detail.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StufeDetailComponent implements OnInit {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly api = inject(Api);

  slug = input.required<string>();

  protected readonly stufe = signal<StufeDetailDto | null>(null);
  protected readonly isLoading = signal(true);
  protected readonly error = signal<string | null>(null);

  readonly calendarUrl = computed<SafeResourceUrl>(() => {
    const url = this.stufe()?.googleCalendarIframeUrl;
    return url ? this.sanitizer.bypassSecurityTrustResourceUrl(url) : '';
  });

  ngOnInit(): void {
    this.api.invoke$Response(getBySlug, { slug: this.slug() }).then(
      response => {
        this.stufe.set(response.body);
        this.isLoading.set(false);
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
