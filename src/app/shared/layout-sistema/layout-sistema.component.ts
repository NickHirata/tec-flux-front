import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout-sistema',
  standalone: true,
  imports: [RouterOutlet,
    CommonModule, RouterLink],
  templateUrl: './layout-sistema.component.html',
  styleUrl: './layout-sistema.component.scss'
})
export class LayoutSistemaComponent implements AfterViewInit {
  @ViewChild('mainContent') mainContent!: ElementRef;
  isSidebarOpen: boolean = false;

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    this.adjustContent();
    this.cdr.detectChanges(); // Força a atualização dos elementos visuais
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
    this.adjustContent();
  }

  adjustContent() {
    if (this.mainContent) {
      if (this.isSidebarOpen) {
        this.mainContent.nativeElement.classList.add('full-width');
      } else {
        this.mainContent.nativeElement.classList.remove('full-width');
      }
    }
  }

  
}
