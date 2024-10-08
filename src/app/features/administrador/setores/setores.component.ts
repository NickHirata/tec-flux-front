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

@Component({
  selector: 'app-setores',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ToastModule,
    TableModule,
    DialogModule,
    ButtonModule,
    ToolbarModule
  ],
  providers: [MessageService],
  templateUrl: './setores.component.html',
  styleUrls: ['./setores.component.scss']
})
export class SetoresComponent implements OnInit {
  setorForm: FormGroup;
  deleteForm: FormGroup;
  setores: any[] = [];
  setorDialog: boolean = false;
  deleteDialog: boolean = false;
  companyId: number | null = null;
  selectedSetorToDelete: any;

  // Variáveis para paginação
  totalRecords: number = 0;
  loading: boolean = false;
  pageSize: number = 10; // Tamanho padrão da página
  pageIndex: number = 0; // Índice da página atual

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private messageService: MessageService
  ) {
    // Inicializa o formulário sem definir o companyId ainda
    this.setorForm = this.fb.group({
      companyId: ['', Validators.required],
      name: ['', Validators.required],
      description: ['', Validators.required]
    });

    this.deleteForm = this.fb.group({
      companyId: ['', Validators.required],
      name: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit() {
    // Obtém o companyId do sessionStorage
    const storedCompanyId = sessionStorage.getItem('companyId');
    if (storedCompanyId) {
      this.companyId = Number(storedCompanyId);

      // Atualiza o campo companyId no formulário
      this.setorForm.patchValue({ companyId: this.companyId });
      this.deleteForm.patchValue({ companyId: this.companyId });

      // Busca os setores ao carregar o componente
      this.fetchSetores();
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
      return new HttpHeaders();
    }
  }

  // Método para buscar os setores com base no companyId e na paginação
  fetchSetores(event?: any) {
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

      this.http.get<any>(`http://localhost:8081/company/${this.companyId}/departments`, { headers, params }).subscribe(
        (response) => {
          this.setores = response.content; // Atualiza a lista de setores com o conteúdo da resposta
          this.totalRecords = response.totalElements; // Atualiza o total de registros
          this.loading = false;
        },
        (error) => {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao buscar setores!' });
          this.loading = false;
        }
      );
    }
  }

  openSetorDialog() {
    this.setorForm.reset({ companyId: this.companyId, name: '', description: '' });
    this.setorDialog = true;
  }

  openDeleteDialog() {
    this.deleteForm.reset({ companyId: this.companyId, name: '', description: '' });
    this.deleteDialog = true;
  }

  hideDialog() {
    this.setorDialog = false;
    this.deleteDialog = false;
  }

  onSubmitSetor() {
    if (this.setorForm.valid) {
      const headers = this.getAuthHeaders();

      this.http.post('http://localhost:8081/departments', this.setorForm.value, { headers }).subscribe(
        (response) => {
          // Após cadastrar, atualiza a lista de setores
          this.fetchSetores();
          this.setorDialog = false;     // Fecha o diálogo
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Setor cadastrado com sucesso!' });
        },
        (error) => {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao cadastrar setor!' });
        }
      );
    } else {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Por favor, preencha todos os campos corretamente.' });
    }
  }

  showDeleteSetor() {
    if (this.selectedSetorToDelete) {
      const headers = this.getAuthHeaders();
      const url = `http://localhost:8081/user/${this.selectedSetorToDelete.value}`; // Assumindo que `value` é o ID do funcionário
  
      this.http.delete(url, { headers }).subscribe(
        (response) => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Funcionário excluído com sucesso!' });
          // Atualiza a lista de funcionários após exclusão
          this.fetchSetores();
        },
        (error) => {
          console.error('Erro ao excluir funcionário', error);
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao excluir o funcionário!' });
        }
      );
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Por favor, selecione um funcionário para excluir.' });
    }
  }
}
