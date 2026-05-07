import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { StufeStore } from '../../../core/store/stufe.store';

@Component({
  selector: 'app-stufe-detail',
  imports: [DatePipe],
  templateUrl: './stufe-detail.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StufeDetailComponent {
  private readonly sanitizer = inject(DomSanitizer);
  protected readonly stufeStore = inject(StufeStore);

  slug = input.required<string>();

  readonly stufe = computed(() => this.stufeStore.stufeBySlug()[this.slug()] ?? null);

  readonly calendarUrl = computed<SafeResourceUrl>(() => {
    const url = this.stufe()?.calendarUrl;
    return url ? this.sanitizer.bypassSecurityTrustResourceUrl(url) : '';
  });

  constructor() {
    this.stufeStore.loadAll();
  }
}
