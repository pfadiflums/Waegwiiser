import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MediaFile, UpdateMediaMetadataRequest, PageMediaFileResponse } from '../models/media.model';

@Injectable({ providedIn: 'root' })
export class MediaService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/media`;

  upload(
    file: File,
    directory?: string,
    altText?: string,
    caption?: string
  ): Observable<MediaFile> {
    const formData = new FormData();
    formData.append('file', file);
    if (directory) formData.append('directory', directory);
    if (altText) formData.append('altText', altText);
    if (caption) formData.append('caption', caption);

    return this.http.post<MediaFile>(this.apiUrl, formData);
  }

  listFiles(page = 0, size = 20, imagesOnly = false): Observable<PageMediaFileResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('imagesOnly', imagesOnly.toString());

    return this.http.get<PageMediaFileResponse>(this.apiUrl, { params });
  }

  getFileMetadata(id: string): Observable<MediaFile> {
    return this.http.get<MediaFile>(`${this.apiUrl}/${id}/metadata`);
  }

  updateMetadata(id: string, metadata: UpdateMediaMetadataRequest): Observable<MediaFile> {
    return this.http.patch<MediaFile>(`${this.apiUrl}/${id}`, metadata);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getDownloadUrl(id: string): string {
    return `${this.apiUrl}/${id}`;
  }
}
