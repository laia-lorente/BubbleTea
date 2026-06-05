import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface CreateUserPayload {
  name: string;
  surname: string;
  email: string;
  birth_date: string;
  notifications: boolean;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  createUser(payload: CreateUserPayload, token: string): Promise<void> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return firstValueFrom(this.http.post<void>(`${this.apiUrl}/users`, payload, { headers }));
  }
}
