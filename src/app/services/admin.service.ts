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
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://127.0.0.1:5000/api/v1/admin';

  constructor(private http: HttpClient) { }

  /**
   * Obtém a lista de todos os usuários (requer privilégios de Admin).
   */
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  /**
   * Reseta a senha de um usuário (requer privilégios de Admin).
   */
  resetUserPassword(userId: number, newPassword: string): Observable<{ msg: string }> {
    return this.http.post<{ msg: string }>(`${this.apiUrl}/reset_password`, { 
      IDUsuario: userId, 
      newPassword: newPassword 
    });
  }
}
