import { Component } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { CardModule } from 'primeng/card'; 
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-graficos',
  standalone: true,
  imports: [NgxChartsModule, CardModule, ButtonModule],
  templateUrl: './graficos.component.html',
  styleUrls: ['./graficos.component.scss'] // Corrigido para styleUrls
})
export class GraficosComponent {
  totalChamados: number = 100;
  chamadosAbertos: number = 25;
  chamadosFechados: number = 70;
  chamadosProgresso: number = 5;

  chamadosData = [
    { name: 'Abertos', value: this.chamadosAbertos },
    { name: 'Fechados', value: this.chamadosFechados },
    { name: 'Urgentes', value: this.chamadosProgresso }
  ];

  tecnicosData = [
    { name: 'Técnico 1', value: 10 },
    { name: 'Técnico 2', value: 20 },
    { name: 'Técnico 3', value: 15 }
  ];

  topTecnicosData = [];
  view: [number, number] = [700, 400];
  ultimosChamados: any[] = [];
  chamadosUrgentes: any;

  exportToPDF(titulo: string): void {
      // Aqui você pode implementar a lógica para exportar dados para PDF
      console.log(`Exportando para PDF: ${titulo}`);
      // Implementação adicional aqui
  }

  exportToCSV(titulo: string): void {
      // Aqui você pode implementar a lógica para exportar dados para CSV
      console.log(`Exportando para CSV: ${titulo}`);
      // Implementação adicional aqui
  }
}
