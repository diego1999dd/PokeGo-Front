import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { PokemonListComponent } from './pokemon/pokemon-list/pokemon-list.component';
import { AuthGuard } from './guards/auth-guard'; 

export const routes: Routes = [
  // Rota de Login (Ponto de entrada público)
  { path: 'login', component: LoginComponent },

  // Rota Principal (PROTEGIDA)
  { path: 'pokemon', component: PokemonListComponent, canActivate: [AuthGuard] },
  
  // CORREÇÃO: A rota padrão (/) sempre redireciona para 'login'. 
  // O AuthGuard cuida do acesso à /pokemon após o login.
  { path: '', redirectTo: 'login', pathMatch: 'full' }, 
  
  // Lidar com rotas não encontradas
  { path: '**', redirectTo: 'login' }, 
];