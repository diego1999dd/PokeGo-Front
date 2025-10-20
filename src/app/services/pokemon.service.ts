import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

interface Pokemon {
  codigo: string;
  nome: string;
  imagem_url: string;
  tipos: string[];
  favorito: boolean;
  grupo_batalha: boolean;
  hp: number;
  attack: number;
  defense: number;
}

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private apiUrl = 'http://127.0.0.1:8000/api/v1';
  private isBrowser: boolean;

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  getPokemonList(): Observable<Pokemon[]> {
    if (this.isBrowser) {
      return this.http.get<Pokemon[]>(`${this.apiUrl}/list_pokemon`);
    }

    return new Observable<Pokemon[]>((subscriber) => {
      subscriber.next([]);
      subscriber.complete();
    });
  }

  toggleFavorite(codigo: string): Observable<{ favorito: boolean }> {
    return this.http.post<{ favorito: boolean }>(`${this.apiUrl}/favorite`, { codigo });
  }

  toggleTeam(codigo: string): Observable<{ grupo_batalha: boolean; msg?: string }> {
    return this.http.post<{ grupo_batalha: boolean; msg?: string }>(`${this.apiUrl}/team`, {
      codigo,
    });
  }
}
