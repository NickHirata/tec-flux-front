import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { InputMaskModule } from 'primeng/inputmask';

@Component({
  selector: 'app-abrir-chamado',
  standalone: true,
  imports: [ 
    TableModule,
    FileUploadModule,
    FormsModule,
    ButtonModule,
    RippleModule,
    ToastModule,
    ToolbarModule,
    RatingModule,
    InputTextModule,
    InputTextareaModule,
    DropdownModule,
    RadioButtonModule,
    InputNumberModule,
    DialogModule,
    InputMaskModule],
  templateUrl: './abrir-chamado.component.html',
  styleUrl: './abrir-chamado.component.scss'
})
export class AbrirChamadoComponent {
// Lista de chamados
chamados: any[] = [];
// Objeto para armazenar o chamado atual
chamado: any = {};
// Controle do diálogo de chamado
chamadoDialog: boolean = false;
// Controle de submissão
submitted: boolean = false;

constructor() {
  // Inicialização de exemplos de chamados
  this.chamados = [
    { nome: 'Chamado 1', prioridade: 'Alta' },
    { nome: 'Chamado 2', prioridade: 'Média' }
  ];
}

// Função para abrir o diálogo de criar/editar chamado
openChamadoDiolog() {
  this.chamado = {}; // Limpar o chamado atual
  this.submitted = false; // Resetar o estado de submissão
  this.chamadoDialog = true; // Abrir o diálogo
}

// Função para salvar o chamado
salvarChamado() {
  this.submitted = true;

  // Validação básica dos campos obrigatórios
  if (this.chamado.departamento && this.chamado.categoria && this.chamado.assunto && this.chamado.descricao) {
    if (this.chamado.id) {
      // Atualizar chamado existente
      const index = this.chamados.findIndex(c => c.id === this.chamado.id);
      if (index !== -1) {
        this.chamados[index] = this.chamado;
      }
    } else {
      // Criar novo chamado
      this.chamado.id = this.createId();
      this.chamados.push(this.chamado);
    }

    // Atualizar lista de chamados e fechar o diálogo
    this.chamados = [...this.chamados];
    this.chamadoDialog = false;
    this.chamado = {};
  }
}

// Função para fechar o diálogo de criar/editar chamado
hideDialog() {
  this.chamadoDialog = false;
  this.submitted = false;
}

// Função para criar um ID único (simulação)
createId(): string {
  return Math.random().toString(36).substr(2, 9);
}
}
