import { Component } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgxChartsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  totalChamados: number = 100;
  chamadosAbertos: number = 25;
  chamadosFechados: number = 70;
  chamadosUrgentes: number = 5;
  isCollapsed: boolean = false;

  chamadosData = [
    { name: 'Abertos', value: this.chamadosAbertos },
    { name: 'Fechados', value: this.chamadosFechados },
    { name: 'Urgentes', value: this.chamadosUrgentes }
  ];

  tecnicosData = [
    { name: 'Técnico 1', value: 10 },
    { name: 'Técnico 2', value: 20 },
    { name: 'Técnico 3', value: 15 }
  ];

  view: [number, number] = [700, 400];

  ultimosChamados: any[] = [];

  constructor() {}

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }
}
