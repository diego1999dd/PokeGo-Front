import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string = '';
  loading: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // 1. Redireciona se já estiver logado
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/pokemon']); // Rota de listagem
    }

    // 2. Cria o formulário reativo
    this.loginForm = this.fb.group({
      Login: ['', Validators.required],
      Senha: ['', Validators.required],
    });
  }

  /**
   * Submete o formulário para fazer login.
   */
  onSubmit(): void {
    this.errorMessage = '';

    if (this.loginForm.invalid) {
      this.errorMessage = 'Por favor, preencha todos os campos.';
      return;
    }

    this.loading = true;
    const credentials = this.loginForm.value;

    this.authService.login(credentials).subscribe({
      next: () => {
        // Navega para a tela de Pokémon após o sucesso
        this.router.navigate(['/pokemon']);
      },
      error: (err) => {
        this.loading = false;
        // Exibe mensagem de erro do Back-End
        if (err.status === 401) {
          this.errorMessage = 'Login ou senha inválidos.';
        } else {
          this.errorMessage = 'Ocorreu um erro na conexão com o servidor.';
        }
      },
    });
  }
}