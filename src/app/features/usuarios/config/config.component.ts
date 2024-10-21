import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { PanelModule } from 'primeng/panel';
import { Router } from '@angular/router'; // Importando o Router

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
  styleUrls: ['./config.component.scss']
})
export class ConfigComponent {

  constructor(private router: Router) {} // Injetando o Router

  togglePasswordForm() {
    // Aqui pode ser usada para exibir/ocultar a interface se necessário
  }

  changePassword() {
    // Redireciona diretamente para a página de reset
    this.router.navigate(['/reset']);
  }
}
