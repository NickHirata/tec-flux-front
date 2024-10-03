import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    MessageModule,
  ],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  message: string | null = null;

  constructor(private fb: FormBuilder, private router: Router, private http: HttpClient) {
    this.resetForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // Adiciona verificação de senhas correspondentes após a inicialização
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
    if (this.resetForm.valid) {
      const payload = {
        temporaryPassword: this.resetForm.get('temporaryPassword')?.value,
        newPassword: this.resetForm.get('newPassword')?.value,
      };

      // Realiza a requisição POST para o endpoint fornecido
      this.http.post('http://localhost:8081/user/63/update-password', payload).subscribe(
        (response) => {
          // Exibe a mensagem de sucesso e redireciona para o login após um tempo
          this.message = 'Senha redefinida com sucesso!';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        (error) => {
          // Exibe mensagem de erro em caso de falha
          this.message = 'Erro ao redefinir senha. Tente novamente.';
          console.error('Erro ao redefinir senha:', error);
        }
      );
    } else {
      this.message = 'Erro ao redefinir senha. Verifique os campos.';
    }
  }
}
