import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Stufe, CreateStufeRequest, UpdateStufeRequest } from '../models/stufe.model';
import { UebungenListResponse } from '../models/uebung.model';

@Injectable({ providedIn: 'root' })
export class StufeService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/stufen`;

  getAll(): Observable<Stufe[]> {
    return this.http.get<Stufe[]>(this.apiUrl);
  }

  getBySlug(slug: string): Observable<Stufe> {
    return this.http.get<Stufe>(`${this.apiUrl}/${slug}`);
  }

  getUebungen(slug: string): Observable<UebungenListResponse> {
    return this.http.get<UebungenListResponse>(`${this.apiUrl}/${slug}/uebungen`);
  }

  create(stufe: CreateStufeRequest): Observable<Stufe> {
    return this.http.post<Stufe>(`${environment.apiUrl}/admin/stufen`, stufe);
  }

  update(id: string, stufe: UpdateStufeRequest): Observable<Stufe> {
    return this.http.patch<Stufe>(`${environment.apiUrl}/admin/stufen/${id}`, stufe);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/admin/stufen/${id}`);
  }
}
