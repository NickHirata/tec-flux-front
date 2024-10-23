import { Component } from '@angular/core';
import { GridModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { jsPDF } from 'jspdf';
import * as Papa from 'papaparse';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ListboxModule } from 'primeng/listbox';
import { ProgressBarModule } from 'primeng/progressbar';
import { TableModule } from 'primeng/table';



interface Technician {
  name: string;
  averageResolutionTime: number; // em horas
  resolutionRate: number; // porcentagem
}

@Component({
  selector: 'app-graficos',
  standalone: true,
  imports: [FormsModule,
    ReactiveFormsModule,
    NgxChartsModule,
    ButtonModule,
    CardModule,
    GridModule,
    ListboxModule,
    TableModule,
    ProgressBarModule
],
  templateUrl: './graficos.component.html',
  styleUrl: './graficos.component.scss'
})


export class GraficosComponent {
  totalChamados: number = 100;
  chamadosAbertos: number = 25;
  chamadosFechados: number = 70;
  chamadosProgresso: number = 5;

  data: Technician[] = [
    { name: 'Malik Wiwoho', averageResolutionTime: 2.5, resolutionRate: 95 },
    { name: 'Nancy Aulia', averageResolutionTime: 3.1, resolutionRate: 90 },
    { name: 'Natasha Viresta', averageResolutionTime: 4.0, resolutionRate: 85 },
    { name: 'Wilona Hamda', averageResolutionTime: 2.8, resolutionRate: 88 },
    { name: 'Rava Nanda', averageResolutionTime: 3.5, resolutionRate: 92 },
];
  ultimosChamados = [
    { titulo: 'Erro no sistema', status: 'Fechado' },
    { titulo: 'Problema de rede', status: 'Aberto' },
    { titulo: 'Atualização de software', status: 'Pendente' },
    { titulo: 'Falha de hardware', status: 'Em andamento' },
    { titulo: 'Solicitação de acesso', status: 'Resolvido' }
  ];
  view: [number, number] = [700, 400];


  // Dados para os gráficos
  tempoMedioResolucaoData = [
    { name: 'Técnico 1', value: 5 },
    { name: 'Técnico 2', value: 3 },
    { name: 'Técnico 3', value: 6 },
    { name: 'Técnico 4', value: 4 },
    { name: 'Técnico 5', value: 2 }
  ];

  topTecnicosData = [
    { name: 'Técnico 1', value: 20 },
    { name: 'Técnico 2', value: 18 },
    { name: 'Técnico 3', value: 15 },
    { name: 'Técnico 4', value: 12 },
    { name: 'Técnico 5', value: 10 }
  ];

  quantidadeSolucoesData = [
    { name: 'Chamados Resolvidos', value: 80 },
    { name: 'Chamados Não Resolvidos', value: 20 }
  ];

  constructor() {}

  ngOnInit(): void {}

  // Função para exportar dados para CSV
  exportToCSV(dataKey: string) {
      const data = [
        { name: 'Técnico 1', chamadosResolvidos: 5, tempoMedioResolucao: '2 horas' },
        { name: 'Técnico 2', chamadosResolvidos: 8, tempoMedioResolucao: '1.5 horas' },
        // Adicione mais dados conforme necessário
      ];

      const csv = Papa.unparse(data);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'relatorio.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    }

  // Função para exportar dados para PDF
  exportToPDF(title: string) {
    const doc = new jsPDF();
    doc.text(title, 10, 10);
    doc.save(`${title}.pdf`);
  }

}
