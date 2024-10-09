import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-reset-new-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-new-password.component.html',
  styleUrls: ['./reset-new-password.component.scss'],
})
export class ResetNewPasswordComponent {
  resetForm: FormGroup;
  message: string | null = null;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('newPassword')?.value === form.get('confirmPassword')?.value ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.resetForm.valid) {
      const { newPassword } = this.resetForm.value;

      // Chamada para o backend (ajuste a URL conforme necessário)
      this.http.post('http://localhost:8081/user/reset-password', { password: newPassword }).subscribe(
        response => {
          this.message = 'Senha redefinida com sucesso!';
          // Aqui você pode redirecionar ou fazer outra lógica após a redefinição
        },
        error => {
          this.message = 'Erro ao redefinir a senha. Tente novamente.';
        }
      );
    } else {
      this.message = 'Por favor, preencha todos os campos corretamente.';
    }
  }
}
