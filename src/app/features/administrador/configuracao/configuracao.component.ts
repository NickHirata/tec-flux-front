import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-configuracao',
  standalone: true,
  imports: [FormsModule, 
    DropdownModule, 
    PanelModule, 
    ButtonModule,
    CommonModule],
  templateUrl: './configuracao.component.html',
  styleUrl: './configuracao.component.scss'
})
export class ConfiguracaoComponent {
  changeDepartmentVisible: boolean = false;
  changePasswordVisible: boolean = false;
  changeEmailVisible: boolean = false;
  deleteUserVisible: boolean = false;

  employees: any[] = [
    { nome: 'João Silva', id: 1 },
    { nome: 'Maria Oliveira', id: 2 }
  ];
  departments: any[] = [
    { nome: 'TI', id: 1 },
    { nome: 'RH', id: 2 }
  ];
  users: any[] = [
    { nome: 'João Silva', id: 1 },
    { nome: 'Maria Oliveira', id: 2 }
  ];

  selectedEmployee: any;
  newDepartment: any;
  newPassword: string = '';
  newEmail: string = '';
  selectedUserToDelete: any;

  showChangeDepartment() {
    this.resetVisibility();
    this.changeDepartmentVisible = true;
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
    this.deleteUserVisible = true;
  }

  resetVisibility() {
    this.changeDepartmentVisible = false;
    this.changePasswordVisible = false;
    this.changeEmailVisible = false;
    this.deleteUserVisible = false;
  }

  changeDepartment() {
    // Lógica para alterar o departamento
    console.log(`Funcionário: ${this.selectedEmployee.nome}, Novo Departamento: ${this.newDepartment.nome}`);
  }

  changePassword() {
    // Lógica para alterar a senha
    console.log(`Nova senha: ${this.newPassword}`);
  }

  changeEmail() {
    // Lógica para alterar o e-mail
    console.log(`Novo e-mail: ${this.newEmail}`);
  }

  deleteUser() {
    // Lógica para excluir o usuário
    console.log(`Usuário excluído: ${this.selectedUserToDelete.nome}`);
  }
}
