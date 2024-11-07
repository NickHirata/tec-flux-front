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
import { lastValueFrom } from 'rxjs';

interface Task {
  id: number;
  nome: string;
  departamento: number;
  descricao: string;
  prioridadeId: number;
  prioridadeNome: string;
  progresso: number;
  dataCriacao: Date;
  dataResolucao: Date | null;
  assignedUserId: number | null;
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
  employees: any[] = [];
  companyId: number | null = null;
  departmentId: number | null = null;

  prioridades: any[] = [
    { label: 'CRITICO', value: 10 },
    { label: 'URGENTE', value: 11 },
    { label: 'ALTA', value: 12 },
    { label: 'MEDIA', value: 13 },
    { label: 'BAIXA', value: 14 },
  ];  

  boardColumns: BoardColumn[] = [
    { name: 'A Fazer', tasks: [], color: '#B3E5FC' }, // OPEN
    { name: 'Em Progresso', tasks: [], color: '#64B5F6' }, // IN_PROGRESS
    { name: 'Concluído', tasks: [], color: '#0288D1' } // RESOLVED
  ];

  constructor(private messageService: MessageService, private http: HttpClient) {}

  ngOnInit() {
    const storedCompanyId = sessionStorage.getItem('companyId');
    const storedDepartmentId = sessionStorage.getItem('departmentId');
    if (storedCompanyId && storedDepartmentId) {
      this.companyId = Number(storedCompanyId);
      this.departmentId = Number(storedDepartmentId);
      this.loadTickets();
      this.loadDepartamentos(); // Verifique se esta chamada está presente
      this.fetchEmployees(); // Verifique se esta chamada está presente
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

  // Função para normalizar strings (remover acentos)
  private normalizeString(str: string): string {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  initializeBoardColumns(tickets: any[]) {
    this.boardColumns.forEach(column => column.tasks = []);
  
    tickets.forEach(ticket => {
      // Verifica se o status da tarefa está entre os três desejados
      if (['OPEN', 'IN_PROGRESS', 'RESOLVED'].includes(ticket.statusName)) {
        const prioridade = this.prioridades.find(p => this.normalizeString(p.label) === this.normalizeString(ticket.priorityName));
  
        const task: Task = {
          id: ticket.id,
          nome: ticket.title,
          departamento: ticket.departmentId,
          descricao: ticket.description,
          prioridadeId: prioridade ? prioridade.value : 0,
          prioridadeNome: ticket.priorityName || 'Desconhecida',
          progresso: this.getProgressValue(ticket.statusId),
          dataCriacao: new Date(ticket.createdAt),
          dataResolucao: ticket.dueDate ? new Date(ticket.dueDate) : null,
          assignedUserId: ticket.userAssignedName ? ticket.userAssignedName : null,
          historico: []
        };
  
        // Adiciona a tarefa na coluna correta com base no status
        switch (ticket.statusName) {
          case 'OPEN':
            this.boardColumns[0].tasks.push(task);
            break;
          case 'IN_PROGRESS':
            this.boardColumns[1].tasks.push(task);
            break;
          case 'RESOLVED':
            this.boardColumns[2].tasks.push(task);
            break;
        }
      }
    });
  }

  getProgressValue(statusId: number): number {
    switch (statusId) {
      case 1:
        return 0;
      case 2:
        return 50;
      case 3:
        return 100;
      default:
        return 0;
    }
  }

  getConnectedDropLists() {
    return this.boardColumns.map((_, index) => `cdk-drop-list-${index}`);
  }

  onTaskDrop(event: CdkDragDrop<Task[]>, columnIndex: number) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
  
      const movedTask = event.container.data[event.currentIndex];
      const newStatusName = this.getStatusNameFromColumnIndex(columnIndex);
  
      // Atualize o status do chamado via API
      this.updateTicketStatus(movedTask.id, newStatusName);
    }
  }
  
  getStatusNameFromColumnIndex(columnIndex: number): string {
    switch (columnIndex) {
      case 0:
        return 'OPEN';
      case 1:
        return 'IN_PROGRESS';
      case 2:
        return 'RESOLVED';
      default:
        return 'OPEN';
    }
  }

  updateTicketStatus(ticketId: number, statusName: string) {
    const headers = this.getAuthHeaders();
    
    // Mapeie o nome do status para o ID correspondente
    const statusIdMap: { [key: string]: number } = {
      'OPEN': 1,
      'IN_PROGRESS': 2,
      'RESOLVED': 3
    };
  
    const statusId = statusIdMap[statusName];
  
    if (statusId) {
      const body = { statusId }; // Envia o ID do status no corpo da solicitação
  
      this.http.put(`http://localhost:8081/tickets/${ticketId}`, body, { headers }).subscribe(
        response => {
          console.log('Resposta da API após atualização:', response); // Log para verificar o retorno
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Status do chamado atualizado' });
  
          // Opcional: Atualize a interface após a confirmação da API
          this.loadTickets();
        },
        error => {
          console.error('Erro ao atualizar status do chamado', error);
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao atualizar o status do chamado' });
        }
      );
    } else {
      console.error('Status inválido fornecido:', statusName);
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Status inválido fornecido' });
    }
  }
  

  openTaskDialog(task: Task) {
    const headers = this.getAuthHeaders();
    this.http.get<any>(`http://localhost:8081/tickets/${task.id}`, { headers }).subscribe(
      (response) => {
        this.selectedTask = {
          id: response.id,
          nome: response.title,
          departamento: response.departmentId,
          descricao: response.description,
          prioridadeId: response.priorityId,
          prioridadeNome: response.priorityName || 'Desconhecida',
          progresso: this.getProgressValue(response.statusId),
          dataCriacao: new Date(response.createdAt),
          dataResolucao: response.resolvedAt ? new Date(response.resolvedAt) : null,
          assignedUserId: response.user_assigned_id || null,
          historico: response.history || []
        };

        console.log('Prioridade selecionada:', this.selectedTask.prioridadeNome);
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
        departmentId: this.selectedTask.departamento,
        user_assigned_id: this.selectedTask.assignedUserId, // Altere para o nome correto do campo no banco de dados
        priorityId: this.selectedTask.prioridadeId,
      };      

      console.log('Dados enviados para atualização:', updatedTicket);

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
      this.http.get<any>(`http://localhost:8081/company/${this.companyId}/departments`, { headers }).subscribe(
        (response) => {
          // Use response.content se a API retornar os departamentos dentro de 'content'
          this.departamentos = response.content.map((department: any) => ({
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

  fetchEmployees(): Promise<void> {
    if (this.companyId !== null) {
      const headers = this.getAuthHeaders();

      return lastValueFrom(this.http.get<any>(`http://localhost:8081/company/${this.companyId}/users`, { headers })).then(
        (response) => {
          // Mapear os funcionários para o formato correto para o dropdown
          this.employees = response.content.map((employee: any) => ({
            label: employee.name,
            value: employee.id
          }));
        },
        (error) => {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao buscar funcionários!' });
        }
      );
    }
    return Promise.resolve();
  }

  getAssignedUserName(): string {
    if (this.selectedTask && this.selectedTask.assignedUserId != null) {
      if (this.employees && this.employees.length > 0) {
        const assignedUser = this.employees.find(emp => emp.value === this.selectedTask!.assignedUserId);
        return assignedUser ? assignedUser.label : 'Usuário não encontrado';
      } else {
        return 'Carregando funcionários...';
      }
    }
    return 'Usuário não atribuído';
  }
}
