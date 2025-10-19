import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface User {
  IDUsuario: number;
  Nome: string;
  Email: string;
  IsAdmin: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private apiUrl = 'http://127.0.0.1:5000/api/v1/admin';

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  // NOVO: Função para promover/remover status de administrador
  setAdminStatus(userId: number, isAdmin: boolean): Observable<{ msg: string }> {
    return this.http.post<{ msg: string }>(`${this.apiUrl}/set_admin`, {
      IDUsuario: userId,
      IsAdmin: isAdmin,
    });
  }

  resetUserPassword(userId: number, newPassword: string): Observable<{ msg: string }> {
    return this.http.post<{ msg: string }>(`${this.apiUrl}/reset_password`, {
      IDUsuario: userId,
      newPassword: newPassword,
    });
  }
}
