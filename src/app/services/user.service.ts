import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { UserResponse, CreateUserRequest } from '../models/auth.model';

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  username?: string;
}

export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/users`;

  getAllUsers(): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(`${environment.apiUrl}/admin/users`);
  }

  createUser(data: CreateUserRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${environment.apiUrl}/admin/users`, data);
  }

  adminResetPassword(id: string, newPassword: string): Observable<void> {
    return this.http.patch<void>(`${environment.apiUrl}/admin/users/${id}/password`, { newPassword });
  }

  adminUpdateRole(id: string, roles: string[]): Observable<void> {
    return this.http.patch<void>(`${environment.apiUrl}/admin/users/${id}/role`, { roles });
  }

  getMe(): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.apiUrl}/me`);
  }

  updateMe(data: UpdateProfileRequest): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${this.apiUrl}/me`, data);
  }

  updatePassword(data: UpdatePasswordRequest): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/me/password`, data);
  }

  removeConnection(provider: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/me/connections/${provider}`);
  }

  getUserById(id: string): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.apiUrl}/${id}`);
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
