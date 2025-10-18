import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { PokemonListComponent } from './pokemon/pokemon-list/pokemon-list.component';
import { authGuard } from './guards/auth-guard';
import { RegisterComponent } from './auth/register/register.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';

export const APP_ROUTES: Routes = [
  // Rotas Públicas (Login e Cadastro)
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Rotas Protegidas (Requerem JWT)
  { path: 'pokemon', component: PokemonListComponent, canActivate: [authGuard] },

  // Diferencial Admin (Acesso Protegido por Guard)
  { path: 'admin', component: AdminDashboardComponent, canActivate: [authGuard] },

  // Rota Padrão (Redireciona para Login)
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Lidar com rotas não encontradas
  { path: '**', redirectTo: 'login' },
];
