import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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
import { TaskService } from '../../../shared/task.service';
import { CadastroService } from '../../../services/cadastro.service'; // Ajuste o caminho conforme necessário
import { CommonModule } from '@angular/common';
import { PanelModule } from 'primeng/panel';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-abrir-chamado',
  standalone: true,
  imports: [
    CommonModule, // Adicionado
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
    InputMaskModule,
    PanelModule
  ],
  providers: [MessageService],
  templateUrl: './abrir-chamado.component.html',
  styleUrls: ['./abrir-chamado.component.scss']
})
export class AbrirChamadoComponent implements OnInit {

  chamados: any[] = [];
  chamado: any = {};
  chamadoDialog: boolean = false;
  submitted: boolean = false;

  detalheDialog: boolean = false;
  selectedChamado: any;

  departamentos: any[] = [];
  categorias: any[] = [];
  prioridades: any[] = [
    { label: 'CRÍTICO', value: 10 },
    { label: 'URGENTE', value: 11 },
    { label: 'ALTA', value: 12 },
    { label: 'MÉDIA', value: 13 },
    { label: 'BAIXA', value: 14 },
  ];  
  companyId: number | null = null;

  constructor(
    private http: HttpClient,
    private cadastroService: CadastroService,
    private taskService: TaskService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    const storedCompanyId = sessionStorage.getItem('companyId');
    if (storedCompanyId) {
      this.companyId = Number(storedCompanyId);
      this.loadDepartamentos();
      this.loadChamados();
    } else {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Company ID não encontrado. Por favor, faça login novamente.' });
    }
  }

  // Método para obter os cabeçalhos de autenticação
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

  excluirChamado(chamadoId: number) {
    if (confirm('Tem certeza que deseja excluir este chamado?')) {
      const headers = this.getAuthHeaders();
      this.http.delete(`http://localhost:8081/tickets/${chamadoId}`, { headers }).subscribe(
        () => {
          this.chamados = this.chamados.filter(chamado => chamado.id !== chamadoId);
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Chamado excluído com sucesso!' });
        },
        (error) => {
          console.error('Erro ao excluir chamado', error);
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao excluir chamado' });
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

  loadChamados() {
    const userId = sessionStorage.getItem('id');
    if (userId !== null) {
      const headers = this.getAuthHeaders();
      const params = new HttpParams().set('userId', userId);
  
      this.http.get<any[]>(`http://localhost:8081/tickets`, { headers, params }).subscribe(
        (data) => {
          this.chamados = data;  // Popula o array chamados com os dados retornados
        },
        (error) => {
          console.error('Erro ao carregar chamados', error);
        }
      );
    } else {
      console.error('User ID não encontrado no sessionStorage.');
    }
  }
  

  fetchSetores() {
    if (this.companyId !== null) {
      const headers = this.getAuthHeaders();
  
      this.http.get<any>(`http://localhost:8081/company/${this.companyId}/departments`, { headers }).subscribe(
        (response) => {
          console.log('Response:', response);  

          if (response && Array.isArray(response.content)) {
            this.departamentos = response.content.map((department: any) => ({
              label: department.name,  
              value: department.id   
            }));
          } else {
            console.error('Formato inesperado de resposta da API');
          }
        },
        (error) => {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao buscar departamentos!' });
        }
      );
    }
  }

  openChamadoDialog() {
    this.chamado = {};  
    this.submitted = false;
    this.chamadoDialog = true;
    this.fetchSetores();
  }

  onPriorityChange(event: any) {
    const prioridadeSelecionada = event.value;
    if (prioridadeSelecionada) {
      this.chamado.priority = prioridadeSelecionada; // Usando o value diretamente
    } else {
      this.chamado.priority = null; // Ajusta para quando não houver prioridade selecionada
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

  salvarChamado() {
    this.submitted = true;
    console.log('salvar');
  
    if (this.chamado.departamento && this.chamado.title && this.chamado.descricao) {
      const chamadoData = {
        departmentId: this.chamado.departamento,
        title: this.chamado.title,
        description: this.chamado.descricao,
        companyId: this.companyId,
        userId: sessionStorage.getItem('id'),
        priorityId: this.chamado.prioridade // Agora usa o valor correto da prioridade
      };
      console.log(chamadoData);
      const headers = this.getAuthHeaders();
      this.http.post<any>('http://localhost:8081/tickets', chamadoData, { headers }).subscribe(
        (response) => {
          this.chamados.push(response);
          this.chamadoDialog = false;
          this.chamado = {};
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Chamado criado com sucesso!' });
        },
        (error) => {
          console.error('Erro ao salvar chamado', error);
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao salvar chamado' });
        }
      );
    }
  }  

  hideDialog() {
    this.chamadoDialog = false;
    this.submitted = false;
  }

  verDetalhes(chamado: any) {
    this.selectedChamado = chamado;
    this.detalheDialog = true;
  }

  getDepartmentName(departmentId: number): string {
    const department = this.departamentos.find(d => d.value === departmentId);
    return department ? department.label : 'Não Encontrado';
  }

  getPriorityName(priorityId: number): string {
    const priority = this.prioridades.find(d => d.value === priorityId);
    return priority ? priority.label : 'Não Encontrado';
  }

  getCategoryName(categoryId: number): string {
    const category = this.categorias.find(c => c.value === categoryId);
    return category ? category.label : 'Não Encontrado';
  }
}
