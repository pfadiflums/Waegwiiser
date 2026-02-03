import { ChangeDetectionStrategy, Component, inject, input, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StufenService } from '../../services/stufen.service';
import { Stufen } from '../../models/payload-types/collections/stufen';
import { Uebungen } from '../../models/payload-types/collections/uebungen';
import { RichTextRendererComponent } from '../../components/rich-text-renderer/rich-text-renderer';
import { environment } from '../../../environments/environment';
import { Media } from '../../models/payload-types/collections/media';
import { User } from '../../models/payload-types/collections/user';

@Component({
  selector: 'app-stufe-detail',
  imports: [CommonModule, RichTextRendererComponent],
  templateUrl: './stufe-detail.html',
  styleUrl: './stufe-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StufeDetailComponent {
  private stufenService = inject(StufenService);

  // Route param input
  slug = input.required<string>();

  stufe = signal<Stufen | null>(null);
  nextUebung = signal<Uebungen | null>(null);
  isLoading = signal(true);
  error = signal<string | null>(null);
  apiUrl = environment.apiUrl;

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
    this.stufenService.getStufeBySlug(slug).subscribe({
      next: (stufe) => {
        if (stufe) {
          this.stufe.set(stufe);
          this.loadNextUebung(stufe.id);
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

  private loadNextUebung(stufeId: string) {
    this.stufenService.getNextUebung(stufeId).subscribe({
      next: (uebung) => {
        this.nextUebung.set(uebung);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  getImageUrl(image: string | Media | null | undefined): string {
    if (!image) return 'assets/images/placeholder.jpg';
    if (typeof image === 'string') return `${this.apiUrl}/media/${image}`;
    return image.url ? (image.url.startsWith('http') ? image.url : `${this.apiUrl}${image.url}`) : 'assets/images/placeholder.jpg';
  }

  getLeaderName(leader: string | User): string {
    if (typeof leader === 'string') return leader;
    return leader.pfadiname || `${leader.vorname} ${leader.nachname}`;
  }

  getLeaderImage(leader: string | User): string {
    if (typeof leader === 'string') return 'assets/images/placeholder-avatar.jpg';
    return this.getImageUrl(leader.bild);
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('de-CH', { day: 'numeric', month: 'long', year: 'numeric' });
  }
}
