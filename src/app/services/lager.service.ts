import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Lager, LagerType, CreateLagerRequest, UpdateLagerRequest } from '../models/lager.model';

@Injectable({ providedIn: 'root' })
export class LagerService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/lager`;

  getAll(): Observable<Lager[]> {
    return this.http.get<Lager[]>(this.apiUrl);
  }

  getUpcoming(): Observable<Lager[]> {
    return this.http.get<Lager[]>(`${this.apiUrl}/upcoming`);
  }

  getBySlug(slug: string): Observable<Lager> {
    return this.http.get<Lager>(`${this.apiUrl}/${slug}`);
  }

  // Admin methods
  create(lager: CreateLagerRequest): Observable<Lager> {
    return this.http.post<Lager>(`${environment.apiUrl}/admin/lager`, lager);
  }

  update(id: string, lager: UpdateLagerRequest): Observable<Lager> {
    return this.http.put<Lager>(`${environment.apiUrl}/admin/lager/${id}`, lager);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/admin/lager/${id}`);
  }

  addGalleryImage(id: string, imageId: string): Observable<Lager> {
    return this.http.post<Lager>(
      `${environment.apiUrl}/admin/lager/${id}/gallery/${imageId}`,
      null
    );
  }

  removeGalleryImage(id: string, imageId: string): Observable<Lager> {
    return this.http.delete<Lager>(
      `${environment.apiUrl}/admin/lager/${id}/gallery/${imageId}`
    );
  }
}
