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
  // URL base da sua API Flask
  private readonly apiUrl = 'http://127.0.0.1:5000/api/v1/auth';
  private readonly tokenKey = 'access_token';

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  /**
   * Tenta fazer login com as credenciais fornecidas.
   * @param credentials Objeto com Login e Senha.
   * @returns Observable da resposta do login.
   */
  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        // 1. Salva o token JWT no armazenamento local após um login bem-sucedido
        if (isPlatformBrowser(this.platformId) && response && response.access_token) {
          localStorage.setItem(this.tokenKey, response.access_token);
        }
      })
    );
  }

  /**
   * Obtém o token JWT salvo.
   * @returns O token JWT (string) ou null.
   */
  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  /**
   * Verifica se o usuário está logado (se houver um token).
   * Em uma aplicação real, você também checaria a validade do token.
   * @returns Verdadeiro se o token existir.
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
    }
    this.router.navigate(['/login']);
  }
}
