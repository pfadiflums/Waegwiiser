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
}
