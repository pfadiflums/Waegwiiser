import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LeitendeService } from '../../../../services/leitende.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Leitende } from '../../../../models/payload-types/collections/leitende';
import { BehaviorSubject, switchMap } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Media } from '../../../../models/payload-types/collections/media';

@Component({
  selector: 'app-leitende-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './leitende-list.html',
  styleUrl: './leitende-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeitendeListComponent {
  private leitendeService = inject(LeitendeService);
  private refresh$ = new BehaviorSubject<void>(undefined);
  apiUrl = environment.apiUrl;

  leitende = toSignal(
    this.refresh$.pipe(switchMap(() => this.leitendeService.getLeitende())),
    { initialValue: [] as Leitende[] }
  );

  getImageUrl(image: string | Media | null | undefined): string {
    if (!image) return 'assets/images/placeholder-avatar.jpg';
    if (typeof image === 'string') return `${this.apiUrl}/media/${image}`;
    return image.url ? (image.url.startsWith('http') ? image.url : `${this.apiUrl}${image.url}`) : 'assets/images/placeholder-avatar.jpg';
  }

  deleteLeitende(id: string) {
    if (confirm('Bist du sicher, dass du diese Person löschen möchtest?')) {
       this.leitendeService.deleteLeitende(id).subscribe(() => {
         this.refresh$.next();
       });
    }
  }
}
