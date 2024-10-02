
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
    FormsModule, 
    InputTextModule,
    ButtonModule,
    MessageModule,
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent {
  temporaryPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  message: string | null = null;

  constructor(private router: Router) {}

  onSubmit() {
    if (this.newPassword === this.confirmPassword) {
      this.message = 'Senha redefinida com sucesso!';
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);
    } else {
      this.message = 'As senhas não correspondem.';
    }
  }
}
