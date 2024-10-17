import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
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
    private router: Router
  ) {
    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // Obtain the reset token from query parameters
    const urlParams = new URLSearchParams(window.location.search);
    this.resetToken = urlParams.get('token');

    if (!this.resetToken) {
      this.message = 'Token de redefinição de senha não encontrado ou inválido.';
    }

    // Add password match validation
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
        password: newPassword,
        token: this.resetToken,
      };

      // Perform POST request to reset password endpoint
      this.http
        .post('http://localhost:8081/user/reset-password', payload)
        .subscribe(
          (response) => {
            this.message = 'Senha redefinida com sucesso!';
            // Redirect to login after a short delay
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
