import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  errorMessage: string = '';
  loading: boolean = false;
  successMessage: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/pokemon']); // Se logado, vai para a lista
      return;
    }
    this.registerForm = this.fb.group({
      Nome: ['', Validators.required],
      Login: ['', Validators.required],
      Email: ['', [Validators.required, Validators.email]],
      Senha: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.registerForm.invalid) {
      this.errorMessage = 'Por favor, preencha todos os campos corretamente.';
      return;
    }

    this.loading = true;

    // NOVO: Chamada para a rota de Registro no Back-End
    this.authService.register(this.registerForm.value).subscribe({
      next: (res) => {
        this.loading = false;
        this.successMessage = 'Cadastro realizado com sucesso! Você pode fazer login agora.';
        // O Back-End já define o primeiro usuário como Admin
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 409) {
          this.errorMessage = 'Login ou Email já cadastrado.';
        } else {
          this.errorMessage = 'Ocorreu um erro no cadastro.';
        }
      },
    });
  }
}
