import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'; // Importar o ReactiveFormsModule

@Component({
  selector: 'app-reset-password-email',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], // Adicione ReactiveFormsModule aqui
  templateUrl: './reset-password-email.component.html',
  styleUrls: ['./reset-password-email.component.scss'],
})
export class ResetPasswordEmailComponent {
  emailForm: FormGroup;
  message: string | null = null;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    if (this.emailForm.valid) {
      const email = this.emailForm.value.email;

      // Chamada para o backend (ajuste a URL conforme necessário)
      this.http.post('http://localhost:8081/user/reset-password', { email }).subscribe(
        response => {
          this.message = 'Um e-mail de redefinição de senha foi enviado!';
        },
        error => {
          this.message = 'Erro ao enviar o e-mail. Tente novamente.';
        }
      );
    } else {
      this.message = 'Por favor, insira um e-mail válido.';
    }
  }
}
