import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { User } from '../models/payload-types/collections/user';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getUsers() {
    return this.http.get<{ docs: User[] }>(`${this.apiUrl}/api/users?sort=pfadiname`).pipe(
      map(response => response.docs)
    );
  }

  getUser(id: string) {
    return this.http.get<User>(`${this.apiUrl}/api/users/${id}`);
  }

  createUser(leader: Partial<User>) {
    return this.http.post<User>(`${this.apiUrl}/api/users`, leader);
  }

  updateUser(id: string, leader: Partial<User>) {
    return this.http.patch<User>(`${this.apiUrl}/api/users/${id}`, leader);
  }

  deleteUser(id: string) {
    return this.http.delete(`${this.apiUrl}/api/users/${id}`);
  }
}
