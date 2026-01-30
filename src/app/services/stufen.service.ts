import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Stufen } from '../models/payload-types/collections/stufen';
import { Uebungen } from '../models/payload-types/collections/uebungen';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StufenService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getStufen() {
    return this.http.get<{ docs: Stufen[] }>(`${this.apiUrl}/api/stufen?sort=name`).pipe(
      map(response => response.docs)
    );
  }

  getStufeBySlug(slug: string) {
    return this.http.get<{ docs: Stufen[] }>(`${this.apiUrl}/api/stufen?where[slug][equals]=${slug}&depth=2`).pipe(
      map(response => response.docs[0] || null)
    );
  }

  getNextUebung(stufeId: string) {
    const now = new Date().toISOString();
    return this.http.get<{ docs: Uebungen[] }>(
      `${this.apiUrl}/api/uebungen?where[stufen][in]=${stufeId}&where[datum][greater_than_equal]=${now}&sort=datum&limit=1`
    ).pipe(
      map(response => response.docs[0] || null)
    );
  }
}
