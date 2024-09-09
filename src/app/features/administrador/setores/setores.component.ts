import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';

@Component({
  selector: 'app-setores',
  standalone: true,
  imports: [
    DropdownModule,
    FormsModule,
    ToastModule,    
    ToolbarModule,   
    TableModule,   
    DialogModule,     
    ButtonModule,     
  ],
  templateUrl: './setores.component.html',
  styleUrl: './setores.component.scss'
})
export class SetoresComponent {
  setorDialog: boolean = false; // Controla a visibilidade do diálogo
  setor: any = {}; // Armazena o setor que está sendo cadastrado
  setores: any[] = []; // Lista de setores

  // Abre o diálogo para cadastrar um setor
  openSetorDialog() {
    this.setor = {}; // Limpa os dados do setor ao abrir o diálogo
    this.setorDialog = true;
  }

  // Fecha o diálogo sem salvar
  hideDialog() {
    this.setorDialog = false;
  }

  // Salva o setor (simulação)
  salvarSetor() {
    if (this.setor.nome) {
      this.setores.push(this.setor); // Adiciona o setor à lista
      this.setorDialog = false; // Fecha o diálogo
    }
  }
}
