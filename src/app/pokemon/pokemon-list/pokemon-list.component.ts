import { Component, OnInit, PLATFORM_ID, Inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PokemonService } from '../../services/pokemon.service';
import { AuthService } from '../../services/auth.service';

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

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class PokemonListComponent implements OnInit {
  pokemonList: Pokemon[] = [];
  favoritePokemonCount: number = 0;
  battleGroupPokemonCount: number = 0;
  errorMessage: string = '';
  isBrowser: boolean;
  currentFilter: 'all' | 'favorites' | 'team' = 'all';

  
  currentTypeFilter: string | null = null;

  constructor(
    private pokemonService: PokemonService,
    public authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.loadPokemonList();
    }
  }

  updateCounts(): void {
    this.favoritePokemonCount = this.pokemonList.filter((p) => p.favorito).length;
    this.battleGroupPokemonCount = this.pokemonList.filter((p) => p.grupo_batalha).length;
  }

 
  get filteredPokemonList(): Pokemon[] {
    let filteredList = this.pokemonList || [];

 
    if (this.currentTypeFilter) {
      filteredList = filteredList.filter((p) => p.tipos.includes(this.currentTypeFilter!));
    }

  
    if (this.currentFilter === 'favorites') {
      filteredList = filteredList.filter((p) => p.favorito);
    } else if (this.currentFilter === 'team') {
      filteredList = filteredList.filter((p) => p.grupo_batalha);
    }

    return filteredList;
  }

  
  setFilter(filter: 'all' | 'favorites' | 'team'): void {
    this.currentFilter = filter;
    this.currentTypeFilter = null; 
    this.cdr.markForCheck();
  }

 
  setTypeFilter(type: string | null): void {
   
    this.currentTypeFilter = this.currentTypeFilter === type ? null : type;
    this.currentFilter = 'all'; 
    this.cdr.markForCheck();
  }

  loadPokemonList(): void {
    this.pokemonService.getPokemonList().subscribe({
      next: (list) => {
        this.pokemonList = list;
        this.updateCounts();
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.errorMessage = `Falha ao carregar Pokémon. Verifique sua API.`;
        this.pokemonList = [];
        this.cdr.markForCheck();
      },
    });
  }

  toggleFavorite(pokemon: Pokemon): void {
    this.pokemonService.toggleFavorite(pokemon.codigo).subscribe({
      next: (res) => {
        pokemon.favorito = res.favorito;
        this.updateCounts();
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.errorMessage = 'Erro ao favoritar.';
        this.cdr.markForCheck();
      },
    });
  }

  toggleTeam(pokemon: Pokemon): void {
    this.pokemonService.toggleTeam(pokemon.codigo).subscribe({
      next: (res) => {
        if (res.msg && res.msg.includes('Limite de 6')) {
          alert(res.msg);
        } else {
          pokemon.grupo_batalha = res.grupo_batalha;
          this.updateCounts();
        }
        this.cdr.markForCheck();
      },
      error: (err) => {
        if (err.status === 403 && err.error && err.error.msg) {
          alert(err.error.msg);
        } else {
          this.errorMessage = 'Erro ao adicionar ao time.';
        }
        this.cdr.markForCheck();
      },
    });
  }
}
