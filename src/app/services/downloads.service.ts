import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Download } from '../models/payload-types/collections/download';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DownloadsService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getDownloads() {
    return this.http.get<{ docs: Download[] }>(`${this.apiUrl}/api/downloads?sort=titel`).pipe(
      map(response => response.docs)
    );
  }

  getDownload(id: string) {
    return this.http.get<Download>(`${this.apiUrl}/api/downloads/${id}`);
  }

  createDownload(download: Partial<Download>) {
    return this.http.post<Download>(`${this.apiUrl}/api/downloads`, download);
  }

  updateDownload(id: string, download: Partial<Download>) {
    return this.http.patch<Download>(`${this.apiUrl}/api/downloads/${id}`, download);
  }

  deleteDownload(id: string) {
    return this.http.delete(`${this.apiUrl}/api/downloads/${id}`);
  }
}
