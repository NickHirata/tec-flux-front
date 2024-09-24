import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { PanelModule } from 'primeng/panel';

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
  changePasswordVisible: boolean = false;
  changeEmailVisible: boolean = false;

  newPassword: string = '';
  newEmail: string = '';


  showChangeDepartment() {
    this.resetVisibility();
  }

  showChangePassword() {
    this.resetVisibility();
    this.changePasswordVisible = true;
  }

  showChangeEmail() {
    this.resetVisibility();
    this.changeEmailVisible = true;
  }

  showDeleteUser() {
    this.resetVisibility();
  }

  resetVisibility() {
    this.changePasswordVisible = false;
    this.changeEmailVisible = false;
  }



  changePassword() {
    // Lógica para alterar a senha
    console.log(`Nova senha: ${this.newPassword}`);
  }

  changeEmail() {
    // Lógica para alterar o e-mail
    console.log(`Novo e-mail: ${this.newEmail}`);
  }

}