import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { PopupComponent } from '../../shared/popup/popup.component'; // Import popup

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.css'], // Corrigido para .component.css
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, PopupComponent],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading: boolean = false;

  // Popup properties
  showPopup: boolean = false;
  popupTitle: string = '';
  popupMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef // NOVO: Injeta o ChangeDetectorRef
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
    this.showPopup = false; // Fecha o popup antes de tentar novamente

    if (this.loginForm.invalid) {
      this.popupTitle = 'Erro de Validação';
      this.popupMessage = 'Por favor, preencha todos os campos.';
      this.showPopup = true;
      this.cdr.markForCheck(); // FORÇA A ATUALIZAÇÃO
      return;
    }

    this.loading = true;
    const credentials = this.loginForm.value;

    this.authService.login(credentials).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/pokemon']);
        this.cdr.markForCheck(); // FORÇA A ATUALIZAÇÃO
      },
      error: (err) => {
        this.loading = false; // Desliga o loading
        console.error('Erro no login:', err);

        this.popupTitle = 'Erro no Login';
        // Captura a mensagem de erro específica do Back-End Flask
        if (err.status === 401 && err.error && err.error.msg) {
          this.popupMessage = err.error.msg;
        } else if (err.status === 401) {
          this.popupMessage = 'Login ou senha inválidos. Tente novamente.';
        } else {
          this.popupMessage = 'Ocorreu um erro na conexão com o servidor.';
        }

        this.showPopup = true;
        this.cdr.markForCheck(); // ESSENCIAL: FORÇA O ANGULAR A MOSTRAR O POPUP AGORA
      },
    });
  }

  closePopup(): void {
    this.showPopup = false;
    this.cdr.markForCheck(); // FORÇA A ATUALIZAÇÃO
  }
}
