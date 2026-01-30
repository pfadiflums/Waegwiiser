import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DownloadsService } from '../../../../services/downloads.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Download } from '../../../../models/payload-types/collections/download';
import { BehaviorSubject, switchMap } from 'rxjs';

@Component({
  selector: 'app-downloads-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './downloads-list.html',
  styleUrl: './downloads-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DownloadsListComponent {
  private downloadsService = inject(DownloadsService);
  private refresh$ = new BehaviorSubject<void>(undefined);

  downloads = toSignal(
    this.refresh$.pipe(switchMap(() => this.downloadsService.getDownloads())),
    { initialValue: [] as Download[] }
  );

  deleteDownload(id: string) {
    if (confirm('Bist du sicher, dass du diesen Download löschen möchtest?')) {
      this.downloadsService.deleteDownload(id).subscribe(() => {
        this.refresh$.next();
      });
    }
  }
}
