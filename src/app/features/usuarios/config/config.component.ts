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
  changePasswordVisible: boolean = false;
  changeEmailVisible: boolean = false;

  newEmail: string = '';

  constructor(private router: Router) {}

  showChangeEmail() {
    this.resetVisibility();
    this.changeEmailVisible = true;
  }

  resetVisibility() {
    this.changePasswordVisible = false;
    this.changeEmailVisible = false;
  }

  changeEmail() {
    // Lógica para alterar o e-mail
    console.log(`Novo e-mail: ${this.newEmail}`);
  }

  redirectToReset() {
    this.router.navigate(['/reset']);
  }
}