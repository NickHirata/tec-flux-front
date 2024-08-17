import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout-sistema',
  standalone: true,
  imports: [RouterOutlet,
    CommonModule, RouterLink],
  templateUrl: './layout-sistema.component.html',
  styleUrl: './layout-sistema.component.scss'
})
export class LayoutSistemaComponent {
  isSidebarOpen = false;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
