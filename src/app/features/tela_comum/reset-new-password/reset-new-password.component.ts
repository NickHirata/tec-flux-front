import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router'; // Importar ActivatedRoute
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-new-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    MessageModule,
  ],
  templateUrl: './reset-new-password.component.html',
  styleUrls: ['./reset-new-password.component.scss'],
})
export class ResetNewPasswordComponent implements OnInit {
  resetForm: FormGroup;
  message: string | null = null;
  resetToken: string | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute // Injetar ActivatedRoute
  ) {
    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // Obter o token dos parâmetros de consulta da URL
    this.route.queryParams.subscribe(params => {
      this.resetToken = params['token'];
      console.log('Token obtido da URL:', this.resetToken);

      if (!this.resetToken) {
        this.message = 'Token de redefinição de senha não encontrado ou inválido.';
      }
    });

    // Adicionar validação de correspondência de senhas
    this.resetForm.get('confirmPassword')?.valueChanges.subscribe(() => {
      this.checkPasswords();
    });

    this.resetForm.get('newPassword')?.valueChanges.subscribe(() => {
      this.checkPasswords();
    });
  }

  checkPasswords() {
    const newPassword = this.resetForm.get('newPassword')?.value;
    const confirmPassword = this.resetForm.get('confirmPassword')?.value;

    if (newPassword !== confirmPassword) {
      this.resetForm.get('confirmPassword')?.setErrors({ mismatch: true });
    } else {
      this.resetForm.get('confirmPassword')?.setErrors(null);
    }
  }

  onSubmit() {
    if (this.resetForm.valid && this.resetToken) {
      const newPassword = this.resetForm.get('newPassword')?.value;

      const payload = {
        newPassword: newPassword,
        token: this.resetToken,
      };

      // Realiza a requisição POST para o endpoint de redefinição de senha
      this.http
        .post('http://localhost:8081/user/reset-password', payload)
        .subscribe(
          (response) => {
            this.message = 'Senha redefinida com sucesso!';
            // Redireciona para o login após um curto atraso
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 2000);
          },
          (error) => {
            this.message = 'Erro ao redefinir a senha. Tente novamente.';
            console.error('Erro ao redefinir a senha:', error);
          }
        );
    } else {
      this.message = 'Por favor, preencha todos os campos corretamente.';
    }
  }
}
