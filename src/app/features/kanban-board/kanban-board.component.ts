import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

// Definir a interface para a tarefa
interface Task {
  id: number;
  nome: string;
  departamento: number;
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
    InputTextModule,
    DropdownModule,
    ButtonModule,
    ToastModule,
    DialogModule,
    CalendarModule,
    DragDropModule
  ],
  templateUrl: './kanban-board.component.html',
  styleUrls: ['./kanban-board.component.scss']
})
export class KanbanBoardComponent implements OnInit {
  detalheDialog: boolean = false;
  selectedTask: Task | null = null;
  departamentos: any[] = [];
  companyId: number | null = null;
  departmentId: number | null = null;

  boardColumns: BoardColumn[] = [
    { name: 'A Fazer', tasks: [], color: '#B3E5FC' },
    { name: 'Em Progresso', tasks: [], color: '#64B5F6' },
    { name: 'Concluído', tasks: [], color: '#0288D1' }
  ];

  constructor(private messageService: MessageService, private http: HttpClient) {}

  ngOnInit() {
    const storedCompanyId = sessionStorage.getItem('companyId');
    const storedDepartmentId = sessionStorage.getItem('departmentId');
    if (storedCompanyId && storedDepartmentId) {
      this.companyId = Number(storedCompanyId);
      this.departmentId = Number(storedDepartmentId);
      this.loadTickets();
    } else {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Company ID ou Department ID não encontrado. Por favor, faça login novamente.' });
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

  loadTickets() {
    const headers = this.getAuthHeaders();
    const departmentId = this.departmentId;
    if (departmentId !== null) {
      let params = new HttpParams();
      params = params.set('departmentId', departmentId.toString());

      this.http.get<any[]>('http://localhost:8081/tickets', { headers, params }).subscribe(
        (data) => {
          this.initializeBoardColumns(data);
        },
        (error) => {
          console.error('Erro ao carregar chamados', error);
        }
      );
    } else {
      console.error('Department ID não encontrado.');
    }
  }

  initializeBoardColumns(tickets: any[]) {
    // Limpar tarefas existentes
    this.boardColumns.forEach(column => column.tasks = []);

    tickets.forEach(ticket => {
      const task: Task = {
        id: ticket.id,
        nome: ticket.title, // Usando 'title' do ticket como 'nome' da tarefa
        departamento: ticket.departmentId,
        descricao: ticket.description,
        progresso: this.getProgressValue(ticket.statusId),
        dataCriacao: new Date(ticket.createdAt),
        dataResolucao: ticket.resolvedAt ? new Date(ticket.resolvedAt) : null,
        historico: [] // Podemos deixar vazio aqui, pois carregaremos ao abrir o diálogo
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
    const headers = this.getAuthHeaders();
    this.http.get<any>(`http://localhost:8081/tickets/${task.id}`, { headers }).subscribe(
      (response) => {
        // Atualizar `selectedTask` com os dados completos do chamado
        this.selectedTask = {
          id: response.id,
          nome: response.title, // Usando 'title' como 'nome'
          departamento: response.departmentId,
          descricao: response.description,
          progresso: this.getProgressValue(response.statusId),
          dataCriacao: new Date(response.createdAt),
          dataResolucao: response.resolvedAt ? new Date(response.resolvedAt) : null,
          historico: response.history || []
        };

        // Carregar departamentos
        this.loadDepartamentos();

        this.detalheDialog = true;
      },
      (error) => {
        console.error('Erro ao carregar detalhes do chamado', error);
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao carregar detalhes do chamado' });
      }
    );
  }

  saveTaskDetails() {
    if (this.selectedTask) {
      const headers = this.getAuthHeaders();
      const updatedTicket = {
        title: this.selectedTask.nome, // Usando 'nome' para atualizar o 'title' do ticket
        description: this.selectedTask.descricao,
        departmentId: this.selectedTask.departamento,
        // Inclua outros campos necessários
      };

      this.http.put(`http://localhost:8081/tickets/${this.selectedTask.id}`, updatedTicket, { headers }).subscribe(
        response => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Chamado atualizado' });
          this.detalheDialog = false;
          this.loadTickets();
        },
        error => {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao atualizar o chamado' });
          console.error('Erro ao atualizar chamado', error);
        }
      );
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
}
