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
  private apiUrl = 'http://127.0.0.1:5000/api/v1';
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object // Injeta a plataforma
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  // A requisição só deve ocorrer se estiver no navegador
  getPokemonList(): Observable<Pokemon[]> {
    if (this.isBrowser) {
      // A rota correta é /api/v1/list_pokemon
      return this.http.get<Pokemon[]>(`${this.apiUrl}/list_pokemon`);
    }
    // Retorna um observable vazio para evitar erros no SSR
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
