import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { RippleModule } from 'primeng/ripple';
import { CardModule } from 'primeng/card';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { TableModule } from 'primeng/table';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ProgressBarModule } from 'primeng/progressbar';
import { SliderModule } from 'primeng/slider';
import { FileUploadModule } from 'primeng/fileupload';

// Definir a interface para a tarefa
interface Task {
  nome: string;
  departamento: string;
  categoria: string;
  assunto: string;
  comentarios: string;
  descricao: string;
  progresso: number;
  dataCriacao: Date;
  dataResolucao: Date | null;
  historico: { data: Date, responsavel: string, descricao: string }[];
}


interface BoardColumn {
  name: string;
  tasks: Task[];
  color: string;
}

@Component({
  selector: 'app-kanban-board',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ToolbarModule,
    InputTextModule,
    DropdownModule,
    ButtonModule,
    ToastModule,
    CardModule,
    RippleModule,
    DialogModule,
    CalendarModule,
    TableModule,
    DragDropModule,
    AutoCompleteModule,
    ProgressBarModule, 
    SliderModule,
    FileUploadModule
  ],
  templateUrl: './kanban-board.component.html',
  styleUrls: ['./kanban-board.component.scss']
})
export class KanbanBoardComponent implements OnInit {
  newTask: string = '';
  selectedColumn: number | null = null;
  detalheDialog: boolean = false;
  selectedTask: Task | null = null;

  users = ['João', 'Maria', 'José', 'Ana', 'Carlos']; // Lista de usuários
  filteredUsers: string[] = []; // Lista para armazenar os resultados filtrados

  selectedUser: string | null = null; // Usuário selecionado para atribuição
  departamentos: any[]|undefined;
  categorias: any[]|undefined;

  // Função para filtrar usuários
  filterUsers(event: any) {
    const query = event.query.toLowerCase();
    this.filteredUsers = this.users.filter(user => user.toLowerCase().includes(query));
  }

  // Função para adicionar o usuário ao histórico
  assignUser() {
    if (this.selectedUser && this.selectedTask) {
      // Adicionar ao histórico
      this.selectedTask.historico.push({
        data: new Date(),
        responsavel: this.selectedUser,
        descricao: 'Usuário atribuído ao chamado'
      });

      // Limpar campo de usuário selecionado
      this.selectedUser = null;
    }
  }

  boardColumns: BoardColumn[] = [
    {
      name: 'A Fazer',
      tasks: [
        {
          nome: 'Tarefa 1',
          departamento: '',
          categoria: '',
          assunto: '',
          comentarios: '',
          descricao: '',
          progresso: 0,
          dataCriacao: new Date(),
          dataResolucao: null,
          historico: []
        },
        {
          nome: 'Tarefa 2',
          departamento: '',
          categoria: '',
          assunto: '',
          comentarios: '',
          descricao: '',
          progresso: 0,
          dataCriacao: new Date(),
          dataResolucao: null,
          historico: []
        }
      ],
      color: '#B3E5FC'
    },
    {
      name: 'Em Progresso',
      tasks: [
        {
          nome: 'Tarefa 3',
          departamento: '',
          categoria: '',
          assunto: '',
          comentarios: '',
          descricao: '',
          progresso: 50, // Ajustando progresso para indicar andamento
          dataCriacao: new Date(),
          dataResolucao: null,
          historico: []
        }
      ],
      color: '#64B5F6'
    },
    {
      name: 'Concluído',
      tasks: [
        {
          nome: 'Tarefa 4',
          departamento: '',
          categoria: '',
          assunto: '',
          comentarios: '',
          descricao: '',
          progresso: 100, // Progresso completo
          dataCriacao: new Date(),
          dataResolucao: new Date(), // Data de resolução preenchida para indicar conclusão
          historico: []
        }
      ],
      color: '#0288D1'
    }
  ];
  

  dropdownOptions: { label: string, value: number }[] = [];

  constructor(private messageService: MessageService) {}

  ngOnInit() {
    this.dropdownOptions = this.boardColumns.map((col, index) => ({
      label: col.name,
      value: index
    }));
  }

  addTask(task: string, columnIndex: number | null) {
    if (task.trim() && columnIndex !== null && this.boardColumns[columnIndex]) {
      const newTask: Task = {
        nome: task.trim(),
        departamento: '',
        categoria: '',
        assunto: '',
        comentarios: '', // Novo campo
        descricao: '',   // Novo campo
        progresso: 0,
        dataCriacao: new Date(),
        dataResolucao: null,
        historico: []
      };
      this.boardColumns[columnIndex].tasks.push(newTask);
      this.newTask = '';
      this.selectedColumn = null;
  
      // Exibir toast de sucesso
      this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Tarefa adicionada!' });
    } else {
      // Exibir toast de erro se a coluna não for válida
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Selecione uma coluna válida!' });
    }
  }
  
  
  getConnectedDropLists() {
    return this.boardColumns.map((_, index) => `cdk-drop-list-${index}`);
  }

  onTaskDrop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  openTaskDialog(task: Task) {
    this.selectedTask = { ...task }; // Clonar o objeto para evitar alterações diretas
    this.detalheDialog = true;
  }

  saveTaskDetails() {
    // Implementar lógica para salvar ou atualizar a tarefa
    this.detalheDialog = false;
  }
}
