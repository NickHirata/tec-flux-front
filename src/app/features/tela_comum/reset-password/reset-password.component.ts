import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
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
  userId: number | null = null;

  constructor(private fb: FormBuilder, private router: Router, private http: HttpClient) {
    this.resetForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // Obtém o id do sessionStorage
    const storedId = sessionStorage.getItem('id');
    if (storedId) {
      this.userId = Number(storedId);
    } else {
      this.message = 'ID do usuário não encontrado. Por favor, faça login novamente.';
    }

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

  // Método para obter os headers com o token de autenticação
  private getAuthHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('accessToken');
    const tokenType = sessionStorage.getItem('tokenType');
    console.log('Token Type:', tokenType);
    console.log('Access Token:', token);

    if (token && tokenType) {
      return new HttpHeaders().set('Authorization', `${tokenType} ${token}`);
    } else {
      return new HttpHeaders();
    }
  }

  onSubmit() {
    if (this.resetForm.valid && this.userId !== null) {
      const oldPassword = this.resetForm.get('oldPassword')?.value;
      const newPassword = this.resetForm.get('newPassword')?.value;

      console.log('Old Password:', oldPassword);
      console.log('New Password:', newPassword);

      const payload = {
        oldPassword: oldPassword,
        newPassword: newPassword,
      };

      // Obtém os headers de autenticação
      const headers = this.getAuthHeaders();

      // Realiza a requisição POST para o endpoint fornecido com o userId dinâmico
      this.http.post(`http://localhost:8081/user/${this.userId}/update-password`, payload, { headers }).subscribe(
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
