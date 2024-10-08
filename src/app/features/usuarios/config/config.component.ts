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

  constructor(private router: Router) {}

  resetVisibility() {
    this.changePasswordVisible = false;
  }

  redirectToReset() {
    this.router.navigate(['/reset']);
  }
}