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
  private readonly apiUrl = 'http://127.0.0.1:8000/api/v1/auth';

  private readonly apiBaseUrl = 'http://127.0.0.1:8000/api/v1';

  private readonly tokenKey = 'access_token';
  private readonly adminKey = 'is_admin';

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  changePassword(oldPassword: string, newPassword: string): Observable<{ msg: string }> {
    return this.http.post<{ msg: string }>(`${this.apiBaseUrl}/profile/change_password`, {
      oldPassword,
      newPassword,
    });
  }

  register(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, data);
  }

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

  forgotPassword(loginOrEmail: string): Observable<{ msg: string }> {
    return this.http.post<{ msg: string }>(`${this.apiUrl}/forgot_password`, { loginOrEmail });
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  isAdmin(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.adminKey) === 'true';
    }
    return false;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.adminKey);
    }
    this.router.navigate(['/login']);
  }
}
