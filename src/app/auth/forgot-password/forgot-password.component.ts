import { Component, ChangeDetectorRef } from '@angular/core'; // NOVO: ChangeDetectorRef
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.css'],
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  loading = false;
  message = '';
  isError = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef // NOVO: Injeta o ChangeDetectorRef
  ) {
    this.forgotPasswordForm = this.fb.group({
      loginOrEmail: ['', Validators.required], // A validação de e-mail pode ser feita no Back-End para permitir Login
    });
  }

  onSubmit(): void {
    this.message = '';
    this.isError = false;

    if (this.forgotPasswordForm.invalid) {
      this.message = 'Por favor, insira seu login ou e-mail.';
      this.isError = true;
      this.cdr.markForCheck(); // Força a exibição da mensagem de validação
      return;
    }

    this.loading = true;
    const loginOrEmail = this.forgotPasswordForm.value.loginOrEmail;

    this.authService.forgotPassword(loginOrEmail).subscribe({
      next: (res) => {
        this.loading = false;

        // Captura a senha temporária para fins de teste
        const tempPassword = res.msg.split(': ')[1];

        this.message = `Sucesso! Senha temporária: ${tempPassword}. Use-a para fazer login.`;
        this.isError = false;
        this.cdr.markForCheck(); // ESSENCIAL: Força o Angular a renderizar a mensagem de sucesso
      },
      error: (err) => {
        this.loading = false;
        // Tratar como sucesso para não dar dicas de segurança
        this.message =
          'Se um usuário com este login/e-mail existir, uma senha temporária foi definida.';
        this.isError = false;
        this.cdr.markForCheck(); // Força o Angular a renderizar a mensagem
      },
    });
  }
}
