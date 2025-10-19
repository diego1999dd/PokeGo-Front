import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { PopupComponent } from '../../shared/popup/popup.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, PopupComponent],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading: boolean = false;
  errorMessage: string = '';

  // Popup properties
  showPopup: boolean = false;
  popupTitle: string = '';
  popupMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/pokemon']);
    }

    this.loginForm = this.fb.group({
      Login: ['', Validators.required],
      Senha: ['', Validators.required],
    });
  }

  onSubmit(): void {
    this.showPopup = false;

    if (this.loginForm.invalid) {
      this.popupTitle = 'Erro de Validação';
      this.popupMessage = 'Por favor, preencha todos os campos.';
      this.showPopup = true;
      this.cdr.markForCheck();
      return;
    }

    this.loading = true;
    const credentials = this.loginForm.value;

    this.authService.login(credentials).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/pokemon']);
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.loading = false;
        console.error('Erro no login:', err);

        this.popupTitle = 'Erro no Login';

        if (err.status === 401 && err.error && err.error.msg) {
          this.popupMessage = err.error.msg;
        } else if (err.status === 401) {
          this.popupMessage = 'Login ou senha inválidos. Tente novamente.';
        } else {
          this.popupMessage = 'Ocorreu um erro na conexão com o servidor.';
        }
        this.errorMessage = this.popupMessage;

        this.showPopup = true;
        this.cdr.markForCheck();
      },
    });
  }

  closePopup(): void {
    this.showPopup = false;
    this.cdr.markForCheck();
  }
}
