import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Leitende } from '../models/payload-types/collections/leitende';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LeitendeService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getLeitende() {
    return this.http.get<{ docs: Leitende[] }>(`${this.apiUrl}/api/leitende?sort=pfadiname`).pipe(
      map(response => response.docs)
    );
  }

  getLeader(id: string) {
    return this.http.get<Leitende>(`${this.apiUrl}/api/leitende/${id}`);
  }

  createLeitende(leader: Partial<Leitende>) {
    return this.http.post<Leitende>(`${this.apiUrl}/api/leitende`, leader);
  }

  updateLeitende(id: string, leader: Partial<Leitende>) {
    return this.http.patch<Leitende>(`${this.apiUrl}/api/leitende/${id}`, leader);
  }

  deleteLeitende(id: string) {
    return this.http.delete(`${this.apiUrl}/api/leitende/${id}`);
  }
}
