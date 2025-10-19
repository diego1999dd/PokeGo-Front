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
    private cdr: ChangeDetectorRef
  ) {
    this.forgotPasswordForm = this.fb.group({
      loginOrEmail: ['', Validators.required],
    });
  }

  onSubmit(): void {
    this.message = '';
    this.isError = false;

    if (this.forgotPasswordForm.invalid) {
      this.message = 'Por favor, insira seu login ou e-mail.';
      this.isError = true;
      this.cdr.markForCheck();
      return;
    }

    this.loading = true;
    const loginOrEmail = this.forgotPasswordForm.value.loginOrEmail;

    this.authService.forgotPassword(loginOrEmail).subscribe({
      next: (res) => {
        this.loading = false;

        const tempPassword = res.msg.split(': ')[1];

        this.message = `Sucesso! Senha temporária: ${tempPassword}. Use-a para fazer login.`;
        this.isError = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.loading = false;

        this.message =
          'Se um usuário com este login/e-mail existir, uma senha temporária foi definida.';
        this.isError = false;
        this.cdr.markForCheck();
      },
    });
  }
}
