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
  // URL base para rotas de autenticação (login, register, forgot_password)
  private readonly apiUrl = 'http://127.0.0.1:5000/api/v1/auth';
  // NOVO: URL base para rotas protegidas gerais (profile, list_pokemon)
  private readonly apiBaseUrl = 'http://127.0.0.1:5000/api/v1';

  private readonly tokenKey = 'access_token';
  private readonly adminKey = 'is_admin';

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  /**
   * CORRIGIDO: Permite ao usuário logado mudar a própria senha.
   * Usa apiBaseUrl (que mapeia para /api/v1) para evitar o 404.
   */
  changePassword(oldPassword: string, newPassword: string): Observable<{ msg: string }> {
    return this.http.post<{ msg: string }>(`${this.apiBaseUrl}/profile/change_password`, {
      oldPassword,
      newPassword,
    });
  }

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
          localStorage.setItem(this.adminKey, response.is_admin ? 'true' : 'false');
        }
      })
    );
  }

  /**
   * Solicita a redefinição de senha (usa apiUrl, que é correta para rotas auth).
   */
  forgotPassword(loginOrEmail: string): Observable<{ msg: string }> {
    return this.http.post<{ msg: string }>(`${this.apiUrl}/forgot_password`, { loginOrEmail });
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
   * Verifica se o usuário logado é administrador.
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
      localStorage.removeItem(this.adminKey);
    }
    this.router.navigate(['/login']);
  }
}
