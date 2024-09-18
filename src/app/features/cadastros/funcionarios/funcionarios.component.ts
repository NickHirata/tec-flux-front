// funcionarios.component.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { Router } from '@angular/router'; 
import { DropdownModule } from 'primeng/dropdown';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner'; // Importe o ProgressSpinnerModule
import { FuncionariosService } from '../../../services/funcionarios.service'; // Ajuste o caminho conforme necessário

@Component({
  selector: 'app-funcionarios',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    NgxMaskDirective,
    NgxMaskPipe,
    DropdownModule,    
    ToastModule, 
    ToolbarModule,
    TableModule,
    DialogModule,
    ButtonModule,
    ProgressSpinnerModule, // Adicione o ProgressSpinnerModule aos imports
  ],
  providers: [provideNgxMask(), MessageService],
  templateUrl: './funcionarios.component.html',
  styleUrls: ['./funcionarios.component.scss'],
})

export class FuncionariosComponent implements OnInit {
  employeeDialog: boolean = false;
  employees: any[] = [];
  userForm: FormGroup;
  roles: any[] = [
    { label: 'Funcionário', value: 'ROLE_USUARIO' },
    { label: 'Técnico de T.I', value: 'ROLE_TECNICO' },
    { label: 'Gestor', value: 'ROLE_ADMINISTRADOR' }
  ];

  // Variáveis para armazenar os IDs dinâmicos
  departmentId: number | null = null;
  companyId: number | null = null;

  // Variáveis de paginação
  totalPages: number = 0;
  totalElements: number = 0;
  pageSize: number = 20;
  currentPage: number = 0;

  // Variável para controlar o estado de carregamento
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private funcionariosService: FuncionariosService, // Injeção do serviço
    private router: Router,
    private messageService: MessageService
  ) {
    // Inicialização do formulário será feita no ngOnInit após recuperar os IDs
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      departmentId: [null, Validators.required], // Inicializado como null
      companyId: [null, Validators.required],
      role: [null, Validators.required]
    });
  }

  ngOnInit() {
    this.getSessionData();
    this.loadEmployees(this.currentPage, this.pageSize);
  }

  /**
   * Recupera departmentId e companyId do Session Storage
   */
  getSessionData() {
    const deptId = sessionStorage.getItem('departmentId');
    const compId = sessionStorage.getItem('companyId');

    if (deptId && compId) {
      this.departmentId = Number(deptId);
      this.companyId = Number(compId);

      // Atualiza os campos do formulário com os valores recuperados
      this.userForm.patchValue({
        departmentId: this.departmentId,
        companyId: this.companyId
      });
    } else {
      // Tratamento caso os IDs não estejam disponíveis
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Dados de departamento ou empresa não encontrados na sessão.' });
      // Opcional: redirecionar o usuário ou desabilitar o formulário
      this.router.navigate(['/rota-de-erro']); // Substitua pela rota adequada
    }
  }

  /**
   * Carrega a lista de funcionários com base no companyId e na paginação
   * @param page Número da página
   * @param size Tamanho da página
   */
  loadEmployees(page: number = 0, size: number = 20) {
    if (this.companyId) {
      console.log(`Carregando funcionários para companyId: ${this.companyId}, página: ${page}, tamanho: ${size}`);
      this.isLoading = true; // Inicia o estado de carregamento

      this.funcionariosService.getEmployeesByCompany(this.companyId, page, size).subscribe(
        (data: any) => {
          console.log('Resposta da API:', data);
          // A resposta paginada contém a lista de funcionários na propriedade 'content'
          this.employees = data.content || [];
          this.totalPages = data.totalPages || 0;
          this.totalElements = data.totalElements || 0;
          this.pageSize = data.size || 20;
          this.currentPage = data.number || 0;
          this.isLoading = false; // Finaliza o estado de carregamento
        },
        error => {
          this.isLoading = false;
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao carregar funcionários!' });
          console.error('Erro ao carregar funcionários', error);
        }
      );
    } else {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'ID da empresa não disponível.' });
      // Opcional: Redirecionar ou desabilitar funcionalidades
    }
  }

  /**
   * Lida com a mudança de página na tabela
   * @param event Evento de paginação do PrimeNG
   */
  onPageChange(event: any) {
    this.currentPage = event.first / event.rows;
    this.pageSize = event.rows;
    this.loadEmployees(this.currentPage, this.pageSize);
  }

  openEmployeeDialog() {
    this.userForm.reset();
    // Reaplica os valores dinâmicos após resetar o formulário
    this.userForm.patchValue({
      departmentId: this.departmentId,
      companyId: this.companyId
    });
    this.employeeDialog = true;
  }

  hideDialog() {
    this.employeeDialog = false;
  }

  isFieldInvalid(field: string) {
    return this.userForm.get(field)?.invalid && this.userForm.get(field)?.touched;
  }

  salvarFuncionario() {
    if (this.userForm.valid) {
      const payload = this.userForm.value;
      console.log('Payload para cadastro:', payload); // Adicione um log para depuração

      this.funcionariosService.addEmployee(payload).subscribe(
        response => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Funcionário cadastrado com sucesso!' });
          this.userForm.reset();
          this.loadEmployees(this.currentPage, this.pageSize);  // Recarrega a lista de funcionários
          this.employeeDialog = false;
          setTimeout(() => {
            this.router.navigate(['/sistema/menu-inicial']);
          }, 2000);
        },
        error => {
          if (error.status === 400) {
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro de validação!' });
          } else {
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao cadastrar funcionário!' });
          }
          console.error('Erro ao cadastrar funcionário', error);
        }
      );
    } else {
      this.markAllFieldsAsTouched();
    }
  }

  markAllFieldsAsTouched() {
    Object.values(this.userForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  showPopupMessage(message: string, isError: boolean) {
    this.messageService.add({ severity: isError ? 'error' : 'success', summary: isError ? 'Erro' : 'Sucesso', detail: message });
  }
}