import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../services/admin.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { RouterModule } from '@angular/router';

interface User {
  IDUsuario: number;
  Nome: string;
  Email: string;
  IsAdmin: boolean;
}

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class AdminDashboardComponent implements OnInit {
  users: User[] = [];
  errorMessage: string = '';
  successMessage: string = '';
  newPassword: { [key: number]: string } = {}; // Objeto para armazenar a nova senha de cada usuário

  constructor(
    private adminService: AdminService,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // 1. Redireciona se não for Admin (Proteção Front-End)
    if (!this.authService.isAdmin()) {
      alert('Acesso negado. Apenas administradores.');
      this.router.navigate(['/pokemon']);
      return;
    }
    this.loadUsers();
  }

  loadUsers(): void {
    this.errorMessage = '';
    this.adminService.getAllUsers().subscribe({
      next: (data: User[]) => {
        this.users = data;
      },
      error: (err: any) => {
        console.error('Erro ao carregar usuários:', err);
        this.errorMessage = 'Falha ao carregar lista de usuários.';
      }
    });
  }

  resetPassword(user: User): void {
    const password = this.newPassword[user.IDUsuario];

    if (!password || password.length < 6) {
      alert('A nova senha deve ter pelo menos 6 caracteres.');
      return;
    }
    
    this.successMessage = '';
    this.errorMessage = '';

    this.adminService.resetUserPassword(user.IDUsuario, password).subscribe({
      next: (res: { msg: string }) => {
        this.successMessage = res.msg;
        this.newPassword[user.IDUsuario] = ''; // Limpa o campo
      },
      error: (err: any) => {
        console.error('Erro ao resetar senha:', err);
        this.errorMessage = err.error?.msg || 'Erro ao resetar senha.';
      }
    });
  }
}
