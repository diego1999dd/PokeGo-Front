import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // NOVO: ChangeDetectorRef
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { PopupComponent } from '../../shared/popup/popup.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule, PopupComponent],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  loading: boolean = false;

  showPopup: boolean = false;
  popupTitle: string = '';
  popupMessage: string = '';
  popupType: 'success' | 'error' = 'error';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/pokemon']);
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
    this.showPopup = false;

    if (this.registerForm.invalid) {
      this.popupTitle = 'Erro de Validação';
      this.popupMessage = 'Por favor, preencha todos os campos corretamente.';
      this.popupType = 'error';
      this.showPopup = true;
      this.cdr.markForCheck();
      return;
    }

    this.loading = true;

    this.authService.register(this.registerForm.value).subscribe({
      next: (res) => {
        this.loading = false;
        this.popupTitle = 'Sucesso!';
        this.popupMessage =
          res.msg || 'Cadastro realizado com sucesso! Você será redirecionado para o login.';
        this.popupType = 'success';
        this.showPopup = true;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.loading = false;
        console.error('Erro no cadastro:', err);

        this.popupTitle = 'Erro no Cadastro';
        this.popupType = 'error';

        if (err.status === 409 && err.error && err.error.msg) {
          this.popupMessage = err.error.msg;
        } else {
          this.popupMessage = 'Ocorreu um erro no cadastro. Tente novamente mais tarde.';
        }
        this.showPopup = true;
        this.cdr.markForCheck();
      },
    });
  }

  closePopup(): void {
    this.showPopup = false;
    this.cdr.markForCheck();

    if (this.popupType === 'success') {
      this.router.navigate(['/login']);
    }
  }
}
