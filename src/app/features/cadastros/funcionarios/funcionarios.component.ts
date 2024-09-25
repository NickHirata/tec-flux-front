import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ToolbarModule } from 'primeng/toolbar';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-funcionarios',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ToastModule,
    TableModule,
    DialogModule,
    ButtonModule,
    ToolbarModule,
    DropdownModule
  ],
  providers: [MessageService],
  templateUrl: './funcionarios.component.html',
  styleUrls: ['./funcionarios.component.scss']
})
export class FuncionariosComponent implements OnInit {
  userForm: FormGroup;
  employees: any[] = [];
  employeeDialog: boolean = false;
  companyId: number | null = null;

  // Variáveis para paginação
  totalRecords: number = 0;
  loading: boolean = false;
  pageSize: number = 10; // Tamanho padrão da página
  pageIndex: number = 0; // Índice da página atual

  // Lista de papéis
  roles: any[] = [
    { label: 'Funcionário', value: 'ROLE_USUARIO' },
    { label: 'Técnico de T.I', value: 'ROLE_TECNICO' },
    { label: 'Gestor', value: 'ROLE_ADMINISTRADOR' }
  ];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private messageService: MessageService
  ) {
    // Inicializa o formulário sem definir o companyId ainda
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      departmentId: ['', Validators.required],
      companyId: ['', Validators.required],
      role: [null, Validators.required],
    });
  }

  ngOnInit() {
    // Obtém o companyId do sessionStorage
    const storedCompanyId = sessionStorage.getItem('companyId');
    if (storedCompanyId) {
      this.companyId = Number(storedCompanyId);

      // Atualiza o campo companyId no formulário
      this.userForm.patchValue({ companyId: this.companyId });

      // Busca os funcionários ao carregar o componente
      this.fetchEmployees();
    } else {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Company ID não encontrado. Por favor, faça login novamente.' });
    }
  }

  // Método para obter os headers com o token de autenticação
  private getAuthHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('accessToken');
    const tokenType = sessionStorage.getItem('tokentype');

    if (token && tokenType) {
      return new HttpHeaders().set('Authorization', `${tokenType} ${token}`);
    } else {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Token de autenticação não encontrado. Por favor, faça login novamente.' });
      return new HttpHeaders();
    }
  }

  // Método para buscar os funcionários com base no companyId e na paginação
  fetchEmployees(event?: any) {
    if (this.companyId !== null) {
      this.loading = true;

      // Atualiza o pageIndex e pageSize com base nos eventos de paginação
      if (event) {
        this.pageIndex = event.first / event.rows;
        this.pageSize = event.rows;
      }

      const headers = this.getAuthHeaders();

      // Configura os parâmetros de paginação
      let params = new HttpParams()
        .set('page', this.pageIndex.toString())
        .set('size', this.pageSize.toString());

      this.http.get<any>(`http://localhost:8081/company/${this.companyId}/users`, { headers, params }).subscribe(
        (response) => {
          this.employees = response.content; // Atualiza a lista de funcionários com o conteúdo da resposta
          this.totalRecords = response.totalElements; // Atualiza o total de registros
          this.loading = false;
        },
        (error) => {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao buscar funcionários!' });
          this.loading = false;
        }
      );
    }
  }

  openEmployeeDialog() {
    this.userForm.reset({ companyId: this.companyId, departmentId: '', role: null });
    this.employeeDialog = true;
  }

  hideDialog() {
    this.employeeDialog = false;
  }

  onSubmitEmployee() {
    if (this.userForm.valid) {
      const headers = this.getAuthHeaders();

      this.http.post('http://localhost:8081/user/register', this.userForm.value, { headers }).subscribe(
        (response) => {
          // Após cadastrar, atualiza a lista de funcionários
          this.fetchEmployees();
          this.employeeDialog = false; // Fecha o diálogo
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Funcionário cadastrado com sucesso!' });
        },
        (error) => {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao cadastrar funcionário!' });
        }
      );
    } else {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Por favor, preencha todos os campos corretamente.' });
    }
  }

  isFieldInvalid(field: string): boolean {
    const control = this.userForm.get(field);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }
}
