import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { PanelModule } from 'primeng/panel';
import { Router } from '@angular/router';

@Component({
  selector: 'app-config',
  standalone: true,
  imports: [
    FormsModule,
    DropdownModule,
    PanelModule,
    ButtonModule,
    CommonModule
  ],
  templateUrl: './config.component.html',
  styleUrl: './config.component.scss'
})
export class ConfigComponent {
  changePasswordVisible = false;
  newPassword: string = '';
  confirmPassword: string = '';

  togglePasswordForm() {
    this.changePasswordVisible = !this.changePasswordVisible;
  }

  changePassword() {
    if (this.newPassword === this.confirmPassword) {
      // Implementar a lógica para salvar a nova senha
      console.log('Senha alterada com sucesso:', this.newPassword);
      this.changePasswordVisible = false; // Oculta o formulário após salvar
    } else {
      // Implementar a lógica para lidar com a senha incorreta
      console.error('As senhas não coincidem!');
    }
  }
}
