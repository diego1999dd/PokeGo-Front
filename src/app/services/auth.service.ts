import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = 'http://127.0.0.1:5000/api/v1/auth';
  private readonly tokenKey = 'access_token';
  private readonly adminKey = 'is_admin'; // NOVO: Chave para o status de Admin

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  /**
   * Tenta cadastrar um novo usuário.
   */
  register(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, data);
  }

  /**
   * Tenta fazer login com as credenciais fornecidas.
   */
  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        if (isPlatformBrowser(this.platformId) && response && response.access_token) {
          localStorage.setItem(this.tokenKey, response.access_token);

          // NOVO: Salva o status de administrador retornado pelo Back-End
          localStorage.setItem(this.adminKey, response.is_admin ? 'true' : 'false');
        }
      })
    );
  }

  /**
   * Obtém o token JWT salvo.
   */
  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  /**
   * NOVO: Verifica se o usuário logado é administrador.
   */
  isAdmin(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.adminKey) === 'true';
    }
    return false;
  }

  /**
   * Verifica se o usuário está logado.
   */
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  /**
   * Remove o token e desloga o usuário.
   */
  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.adminKey); // NOVO: Remove o status de Admin
    }
    this.router.navigate(['/login']);
  }
}
