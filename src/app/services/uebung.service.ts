import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Uebung, CreateUebungRequest, UpdateUebungRequest } from '../models/uebung.model';

@Injectable({ providedIn: 'root' })
export class UebungService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/uebungen`;

  getNextForStufe(stufeSlug: string): Observable<Uebung> {
    return this.http.get<Uebung>(`${this.apiUrl}/next/${stufeSlug}`);
  }

  getByStufe(stufeSlug: string): Observable<Uebung[]> {
    return this.http.get<Uebung[]>(`${this.apiUrl}/stufe/${stufeSlug}`);
  }

  create(uebung: CreateUebungRequest): Observable<Uebung> {
    return this.http.post<Uebung>(`${environment.apiUrl}/admin/uebungen`, uebung);
  }

  update(id: string, uebung: UpdateUebungRequest): Observable<Uebung> {
    return this.http.put<Uebung>(`${environment.apiUrl}/admin/uebungen/${id}`, uebung);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/admin/uebungen/${id}`);
  }
}
