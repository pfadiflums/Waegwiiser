import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Uebungen } from '../models/payload-types/collections/uebungen';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UebungenService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getUebungen() {
    return this.http.get<{ docs: Uebungen[] }>(`${this.apiUrl}/api/uebungen?sort=-datum&depth=1`).pipe(
      map(response => response.docs)
    );
  }

  getUebung(id: string) {
    return this.http.get<Uebungen>(`${this.apiUrl}/api/uebungen/${id}?depth=1`);
  }

  createUebung(uebung: Partial<Uebungen>) {
    return this.http.post<Uebungen>(`${this.apiUrl}/api/uebungen`, uebung);
  }

  updateUebung(id: string, uebung: Partial<Uebungen>) {
    return this.http.patch<Uebungen>(`${this.apiUrl}/api/uebungen/${id}`, uebung);
  }

  deleteUebung(id: string) {
    return this.http.delete(`${this.apiUrl}/api/uebungen/${id}`);
  }
}
