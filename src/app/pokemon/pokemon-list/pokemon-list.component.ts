import { Component, OnInit, PLATFORM_ID, Inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PokemonService } from '../../services/pokemon.service';
import { AuthService } from '../../services/auth.service';
import { isPlatformBrowser } from '@angular/common';

interface Pokemon {
  codigo: string;
  nome: string;
  imagem_url: string;
  tipos: string[];
  favorito: boolean;
  grupo_batalha: boolean;
}

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class PokemonListComponent implements OnInit {
  pokemonList: Pokemon[] | null = null;
  errorMessage: string = '';
  isBrowser: boolean;

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

  loadPokemonList(): void {
    this.pokemonService.getPokemonList().subscribe({
      next: (list) => {
        console.log('Dados recebidos com sucesso:', list);
        this.pokemonList = list;
        this.cdr.markForCheck(); // Avisa o Angular para atualizar a tela
      },
      error: (err) => {
        console.error('Erro detalhado ao carregar Pokémon:', err);
        this.errorMessage = `Falha ao carregar Pokémon. Verifique se a API está rodando e o console do navegador para mais detalhes.`;
        this.pokemonList = [];
        this.cdr.markForCheck(); // Avisa o Angular para atualizar a tela
      },
      complete: () => {
        console.log('Requisição para Pokémon concluída.');
      },
    });
  }

  toggleFavorite(pokemon: Pokemon): void {
    this.pokemonService.toggleFavorite(pokemon.codigo).subscribe({
      next: (res) => {
        pokemon.favorito = res.favorito;
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
