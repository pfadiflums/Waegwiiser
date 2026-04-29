import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { UserResponse } from '../models/auth.model';

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
}

export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/users`;

  getMe(): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.apiUrl}/me`);
  }

  updateMe(data: UpdateProfileRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/me`, data);
  }

  updatePassword(data: UpdatePasswordRequest): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/me/password`, data);
  }

  getConnections(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/me/connections`);
  }

  removeConnection(provider: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/me/connections/${provider}`);
  }

  getUserById(id: string): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.apiUrl}/${id}`);
  }

  updateUserRole(id: string, role: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/role`, { role });
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
