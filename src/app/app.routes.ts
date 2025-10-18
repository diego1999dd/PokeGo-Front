import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { PokemonListComponent } from './pokemon/pokemon-list/pokemon-list.component';
import { authGuard } from './guards/auth-guard';
import { RegisterComponent } from './auth/register/register.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password';
import { ChangePasswordComponent } from './profile/change-password/change-password'; // NOVO: Importar o componente

export const APP_ROUTES: Routes = [
  // Rotas Públicas (sem proteção)
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },

  // Rota para mudar a própria senha
  { path: 'change-password', component: ChangePasswordComponent, canActivate: [authGuard] }, // Rota protegida

  // Rotas Protegidas
  { path: 'pokemon', component: PokemonListComponent, canActivate: [authGuard] },
  { path: 'admin', component: AdminDashboardComponent, canActivate: [authGuard] },

  // Rota Padrão
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];
