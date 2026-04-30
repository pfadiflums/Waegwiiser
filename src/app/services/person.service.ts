import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  PersonResponse,
  CreatePersonRequest,
  UpdatePersonProfileRequest,
  AssignStufeRequest,
  PageResponsePersonResponse,
} from '../models/person.model';

@Injectable({ providedIn: 'root' })
export class PersonService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/people`;

  getAllPeople(page = 0, size = 200): Observable<PageResponsePersonResponse> {
    return this.http.get<PageResponsePersonResponse>(this.apiUrl, { params: { page, size } });
  }

  getPersonById(id: string): Observable<PersonResponse> {
    return this.http.get<PersonResponse>(`${this.apiUrl}/${id}`);
  }

  getByStufe(stufeId: string): Observable<PersonResponse[]> {
    return this.http.get<PersonResponse[]>(`${this.apiUrl}/stufe/${stufeId}`);
  }

  getPublicProfiles(): Observable<PersonResponse[]> {
    return this.http.get<PersonResponse[]>(`${this.apiUrl}/public`);
  }

  createPerson(data: CreatePersonRequest): Observable<PersonResponse> {
    return this.http.post<PersonResponse>(this.apiUrl, data);
  }

  updateProfile(id: string, data: UpdatePersonProfileRequest): Observable<PersonResponse> {
    return this.http.patch<PersonResponse>(`${this.apiUrl}/${id}/profile`, data);
  }

  deletePerson(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  assignToStufe(id: string, data: AssignStufeRequest): Observable<PersonResponse> {
    return this.http.post<PersonResponse>(`${this.apiUrl}/${id}/stufen`, data);
  }

  removeFromStufe(id: string, stufeId: string): Observable<PersonResponse> {
    return this.http.delete<PersonResponse>(`${this.apiUrl}/${id}/stufen/${stufeId}`);
  }

  linkToAccount(personId: string, accountId: string): Observable<PersonResponse> {
    return this.http.patch<PersonResponse>(`${this.apiUrl}/${personId}/link/${accountId}`, {});
  }

  unlinkFromAccount(personId: string): Observable<PersonResponse> {
    return this.http.delete<PersonResponse>(`${this.apiUrl}/${personId}/link`);
  }
}
