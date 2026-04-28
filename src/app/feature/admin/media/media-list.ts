import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediaService } from '../../../services/media.service';
import { MediaFile } from '../../../models/media.model';

@Component({
  selector: 'app-media-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-page">
      <div class="header">
        <div class="title-section">
          <p class="subtitle">Verwalte Bilder und Dokumente</p>
        </div>
        <div class="upload-zone">
          <input type="file" #fileInput (change)="onFileSelected($event)" hidden>
          <button class="add-btn" (click)="fileInput.click()">
            <span class="icon">↑</span> Datei hochladen
          </button>
        </div>
      </div>

      <div class="card">
        <div class="media-grid">
          @for (file of mediaFiles(); track file.id) {
            <div class="media-item">
              <div class="preview">
                @if (file.mimeType.startsWith('image/')) {
                  <img [src]="file.url" [alt]="file.altText">
                } @else {
                  <div class="file-icon">📄</div>
                }
                <div class="overlay">
                   <button (click)="deleteFile(file.id)" class="delete-icon-btn" title="Löschen">🗑️</button>
                </div>
              </div>
              <div class="info">
                <span class="filename" [title]="file.originalName">{{ file.originalName }}</span>
                <span class="filesize text-muted">{{ (file.sizeBytes / 1024).toFixed(1) }} KB</span>
              </div>
            </div>
          }
        </div>

        @if (mediaFiles().length === 0) {
          <div class="empty-state">
            <div class="icon">📂</div>
            <p>Keine Dateien vorhanden.</p>
            <button class="upload-link" (click)="fileInput.click()">Lade deine erste Datei hoch</button>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .admin-page {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 0.5rem;

      .subtitle {
        color: var(--admin-text-muted);
        font-size: 0.875rem;
        margin-top: 0.25rem;
        letter-spacing: normal;
      }
    }

    .add-btn {
      padding: 0.625rem 1.25rem;
      background: var(--admin-primary);
      color: white;
      border: none;
      border-radius: 0.5rem;
      font-weight: 500;
      font-size: 0.875rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: background 0.2s;
      &:hover { background: #4f46e5; }
      .icon { font-size: 1.1rem; }
    }

    .card {
      background: white;
      padding: 1.5rem;
      border-radius: 0.75rem;
      border: 1px solid var(--admin-border);
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    }

    .media-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 1.5rem;
    }

    .media-item {
      border: 1px solid var(--admin-border);
      border-radius: 0.5rem;
      overflow: hidden;
      background: #f9fafb;
      transition: transform 0.2s, box-shadow 0.2s;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);

        .overlay { opacity: 1; }
      }

      .preview {
        aspect-ratio: 4/3;
        background: white;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .file-icon { font-size: 3rem; opacity: 0.3; }

        .overlay {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0, 0, 0, 0.2);
          display: flex;
          align-items: flex-start;
          justify-content: flex-end;
          padding: 0.5rem;
          opacity: 0;
          transition: opacity 0.2s;
        }
      }

      .info {
        padding: 0.75rem;
        display: flex;
        flex-direction: column;
        gap: 0.125rem;

        .filename {
          font-size: 0.8125rem;
          font-weight: 500;
          color: var(--admin-text);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .filesize { font-size: 0.75rem; color: var(--admin-text-muted); }
      }
    }

    .delete-icon-btn {
      background: white;
      border: none;
      border-radius: 0.375rem;
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      &:hover { background: #fee2e2; }
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      color: var(--admin-text-muted);

      .icon { font-size: 3rem; margin-bottom: 1rem; opacity: 0.3; }
      p { font-size: 0.875rem; margin-bottom: 1.5rem; letter-spacing: normal; }

      .upload-link {
        background: none;
        border: none;
        color: var(--admin-primary);
        font-weight: 600;
        font-size: 0.875rem;
        cursor: pointer;
        &:hover { text-decoration: underline; }
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MediaListComponent implements OnInit {
  private mediaService = inject(MediaService);

  mediaFiles = signal<MediaFile[]>([]);

  ngOnInit(): void {
    this.loadMedia();
  }

  loadMedia(): void {
    this.mediaService.listFiles(0, 100).subscribe(data => {
      this.mediaFiles.set(data.content);
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.mediaService.upload(file).subscribe(() => {
        this.loadMedia();
      });
    }
  }

  deleteFile(id: string): void {
    if (confirm('Datei wirklich löschen?')) {
      this.mediaService.delete(id).subscribe(() => {
        this.loadMedia();
      });
    }
  }
}
