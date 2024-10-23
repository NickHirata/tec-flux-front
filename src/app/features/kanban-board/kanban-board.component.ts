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
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

// Definir a interface para a tarefa
interface Task {
  id: number; // Tipo ajustado para number
  nome: string;
  departamento: number; // Tipo ajustado para number
  categoria: number;    // Tipo ajustado para number
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
  departamentos: any[] = [];
  categorias: any[] = [];
  prioridades: any[] = [
    { label: 'CRITICO', value: '10' },
    { label: 'URGENTE', value: '11' },
    { label: 'ALTA', value: '12' },
    { label: 'MEDIA', value: '13' },
    { label: 'BAIXA', value: '14' },
  ];
  companyId: number | null = null;

  boardColumns: BoardColumn[] = [
    { name: 'A Fazer', tasks: [], color: '#B3E5FC' },
    { name: 'Em Progresso', tasks: [], color: '#64B5F6' },
    { name: 'Concluído', tasks: [], color: '#0288D1' }
  ];

  dropdownOptions: { label: string, value: number }[] = [];

  constructor(private messageService: MessageService, private http: HttpClient) {}

  ngOnInit() {
    const storedCompanyId = sessionStorage.getItem('companyId');
    if (storedCompanyId) {
      this.companyId = Number(storedCompanyId);
      this.loadDepartamentos();
      this.loadTickets();
    } else {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Company ID não encontrado. Por favor, faça login novamente.' });
    }

    this.dropdownOptions = this.boardColumns.map((col, index) => ({
      label: col.name,
      value: index
    }));
  }

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

  private getAuthHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('accessToken');
    const tokenType = sessionStorage.getItem('tokenType');
    if (token && tokenType) {
      return new HttpHeaders().set('Authorization', `${tokenType} ${token}`);
    } else {
      return new HttpHeaders();
    }
  }

  loadDepartamentos() {
    if (this.companyId !== null) {
      const headers = this.getAuthHeaders();
      this.http.get<any[]>(`http://localhost:8081/company/${this.companyId}/departments`, { headers }).subscribe(
        (response) => {
          this.departamentos = response.map((department: any) => ({
            label: department.name,
            value: department.id
          }));
        },
        (error) => {
          console.error('Erro ao carregar departamentos', error);
        }
      );
    }
  }

  loadCategoriasByDepartamento(departamentoId: number) {
    const headers = this.getAuthHeaders();
    this.http.get<any[]>(`http://localhost:8081/departments/${departamentoId}/categories`, { headers }).subscribe(
      (response) => {
        this.categorias = response.map((category: any) => ({
          label: category.name,
          value: category.id
        }));
      },
      (error) => {
        console.error('Erro ao carregar categorias', error);
      }
    );
  }

  loadTickets() {
    const headers = this.getAuthHeaders();
    const userId = sessionStorage.getItem('id');
    if (userId !== null) {
      let params = new HttpParams();

      // Adicionar apenas parâmetros com valores definidos
      if (userId) {
        params = params.set('userId', userId);
      }

      this.http.get<any[]>('http://localhost:8081/tickets', { headers, params }).subscribe(
        (data) => {
          this.initializeBoardColumns(data);
        },
        (error) => {
          console.error('Erro ao carregar chamados', error);
        }
      );
    } else {
      console.error('User ID não encontrado no sessionStorage.');
    }
  }

  initializeBoardColumns(tickets: any[]) {
    // Limpar tarefas existentes
    this.boardColumns.forEach(column => column.tasks = []);

    tickets.forEach(ticket => {
      const task: Task = {
        id: ticket.id,
        nome: ticket.title,
        departamento: ticket.departmentId,  // Ajustado para departmentId
        categoria: ticket.categoryId,      // Ajustado para categoryId
        assunto: ticket.subject,
        comentarios: ticket.comments,
        descricao: ticket.description,
        progresso: this.getProgressValue(ticket.statusId),
        dataCriacao: new Date(ticket.createdAt),
        dataResolucao: ticket.resolvedAt ? new Date(ticket.resolvedAt) : null,
        historico: [] // Popule se tiver dados de histórico
      };

      // Mapeie o status do ticket para a coluna correspondente
      switch (ticket.statusId) {
        case 1: // Status ID para 'A Fazer'
          this.boardColumns[0].tasks.push(task);
          break;
        case 2: // Status ID para 'Em Progresso'
          this.boardColumns[1].tasks.push(task);
          break;
        case 3: // Status ID para 'Concluído'
          this.boardColumns[2].tasks.push(task);
          break;
        default:
          // Coloque em uma coluna padrão ou trate conforme necessário
          this.boardColumns[0].tasks.push(task);
          break;
      }
    });
  }

  getProgressValue(statusId: number): number {
    switch (statusId) {
      case 1:
        return 0; // A Fazer
      case 2:
        return 50; // Em Progresso
      case 3:
        return 100; // Concluído
      default:
        return 0;
    }
  }

  getConnectedDropLists() {
    return this.boardColumns.map((_, index) => `cdk-drop-list-${index}`);
  }

  onTaskDrop(event: CdkDragDrop<Task[]>, columnIndex: number) {
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

      const movedTask = event.container.data[event.currentIndex];
      const newStatusId = this.getStatusIdFromColumnIndex(columnIndex);

      // Atualize o status do chamado via API
      this.updateTicketStatus(movedTask.id, newStatusId);
    }
  }

  getStatusIdFromColumnIndex(columnIndex: number): number {
    // Mapear os índices das colunas para os IDs de status correspondentes
    switch (columnIndex) {
      case 0:
        return 1; // Status ID para 'A Fazer'
      case 1:
        return 2; // Status ID para 'Em Progresso'
      case 2:
        return 3; // Status ID para 'Concluído'
      default:
        return 1; // Padrão
    }
  }

  updateTicketStatus(ticketId: number, statusId: number) {
    const headers = this.getAuthHeaders();
    const body = { statusId };

    this.http.put(`http://localhost:8081/tickets/${ticketId}/status`, body, { headers }).subscribe(
      response => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Status do chamado atualizado' });
      },
      error => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao atualizar o status do chamado' });
        console.error('Erro ao atualizar status do chamado', error);
      }
    );
  }

  openTaskDialog(task: Task) {
    this.selectedTask = { ...task }; // Clonar o objeto para evitar alterações diretas
    this.detalheDialog = true;

    if (this.selectedTask.departamento) {
      this.loadCategoriasByDepartamento(this.selectedTask.departamento);
    }
  }

  saveTaskDetails() {
    if (this.selectedTask) {
      const headers = this.getAuthHeaders();
      const updatedTicket = {
        title: this.selectedTask.nome,
        description: this.selectedTask.descricao,
        departmentId: this.selectedTask.departamento,
        categoryId: this.selectedTask.categoria,
        // Inclua outros campos necessários
      };

      this.http.put(`http://localhost:8081/tickets/${this.selectedTask.id}`, updatedTicket, { headers }).subscribe(
        response => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Chamado atualizado' });
          this.detalheDialog = false;
          // Recarregue os chamados para refletir as mudanças
          this.loadTickets();
        },
        error => {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao atualizar o chamado' });
          console.error('Erro ao atualizar chamado', error);
        }
      );
    }
  }

  onDepartamentoChange(event: any) {
    const departamentoSelecionado = event.value;
    if (departamentoSelecionado) {
      this.loadCategoriasByDepartamento(departamentoSelecionado);
    } else {
      this.categorias = [];
    }
  }

  // onPriorityChange(event: any) {
  //   const prioridadeSelecionada = event.value;
  //   if (prioridadeSelecionada) {
  //     this.chamado.priority = prioridadeSelecionada; // Usando o value diretamente
  //   } else {
  //     this.chamado.priority = null; // Ajusta para quando não houver prioridade selecionada
  //   }
  // }

  addTask(taskName: string, columnIndex: number | null) {
    if (taskName.trim() && columnIndex !== null && this.boardColumns[columnIndex]) {
      const headers = this.getAuthHeaders();
      const newTicket = {
        title: taskName.trim(),
        statusId: this.getStatusIdFromColumnIndex(columnIndex),
        companyId: this.companyId,
        userId: sessionStorage.getItem('id'),
        // Inclua outros campos necessários, como departmentId, priorityId, etc.
      };

      this.http.post<any>('http://localhost:8081/tickets', newTicket, { headers }).subscribe(
        (response) => {
          const newTask: Task = {
            id: response.id,
            nome: response.title,
            departamento: response.departmentId, // Ajustado para departmentId
            categoria: response.categoryId,     // Ajustado para categoryId
            assunto: response.subject,
            comentarios: response.comments,
            descricao: response.description,
            progresso: this.getProgressValue(response.statusId),
            dataCriacao: new Date(response.createdAt),
            dataResolucao: response.resolvedAt ? new Date(response.resolvedAt) : null,
            historico: []
          };
          this.boardColumns[columnIndex].tasks.push(newTask);
          this.newTask = '';
          this.selectedColumn = null;
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Tarefa adicionada!' });
        },
        (error) => {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao adicionar tarefa' });
        }
      );
    } else {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Selecione uma coluna válida!' });
    }
  }
}
