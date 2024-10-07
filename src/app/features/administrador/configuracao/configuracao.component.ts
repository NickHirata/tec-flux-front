import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-configuracao',
  standalone: true,
  imports: [
    FormsModule, 
    DropdownModule, 
    PanelModule, 
    ButtonModule,
    CommonModule
  ],
  providers: [MessageService],
  templateUrl: './configuracao.component.html',
  styleUrl: './configuracao.component.scss'
})
export class ConfiguracaoComponent implements OnInit {

  changeDepartmentVisible: boolean = false;
  deleteUserVisible: boolean = false;
  companyId: number | null = null;

  departamentos:  any[] = [];
  employees: any[] = [];

  selectedEmployee: any;
  newDepartment: any;
  selectedUserToDelete: any;

  constructor(
    private router: Router,
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    // Obtém o companyId do sessionStorage
    const storedCompanyId = sessionStorage.getItem('companyId');
    if (storedCompanyId) {
      this.companyId = Number(storedCompanyId);

      // Busca os setores ao carregar o componente
      this.fetchEmployees();
      this.fetchSetores();
    } else {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Company ID não encontrado. Por favor, faça login novamente.' });
    }
  }

  fetchSetores(event?: any) {
    if (this.companyId !== null) {
      const headers = this.getAuthHeaders();
  
      // Corrigir a URL para buscar os departamentos
      this.http.get<any>(`http://localhost:8081/company/${this.companyId}/departments`, { headers }).subscribe(
        (response) => {
          this.departamentos = response.content.map((department: any) => ({
            label: department.name, 
            value: department.id 
          }));
        },
        (error) => {
          console.error('Erro ao buscar departamentos', error);
        }
      );      
    }
  }

  fetchEmployees(event?: any) {
    if (this.companyId !== null) {
      const headers = this.getAuthHeaders();
  
      this.http.get<any>(`http://localhost:8081/company/${this.companyId}/users`, { headers }).subscribe(
        (response) => {
          // Mapear os funcionários para o formato correto para o dropdown
          console.log('Lista de Funcionários:', response.content); // Adicione este log para depuração
          this.employees = response.content.map((employee: any) => ({
            label: employee.name, // Certifique-se de que 'nome' seja o campo correto
            value: employee.id // ID para o valor do dropdown
          }));
        },
        (error) => {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao buscar funcionários!' });
        }
      );
    }
  }

  // Método para obter os headers com o token de autenticação
  private getAuthHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('accessToken');
    const tokenType = sessionStorage.getItem('tokenType'); // Verifique a capitalização aqui
    console.log('Token Type:', tokenType);
    console.log('Access Token:', token);

    if (token && tokenType) {
      return new HttpHeaders().set('Authorization', `${tokenType} ${token}`);
    } else {
      return new HttpHeaders();
    }
  }

  showChangeDepartment() {
    this.resetVisibility();
    this.changeDepartmentVisible = true;
  }

  showDeleteUser() {
    this.resetVisibility();
    this.deleteUserVisible = true;
  }

  resetVisibility() {
    this.changeDepartmentVisible = false;
    this.deleteUserVisible = false;
  }

  changeDepartment() {
    this.updateUserDepartment();
  }
  
  updateUserDepartment() {
    if (this.selectedEmployee && this.newDepartment) {
      const headers = this.getAuthHeaders();
      const url = `http://localhost:8081/user/${this.companyId}`;
      const payload = {
        departmentId: this.newDepartment.value // ou o campo que corresponde ao ID do departamento
      };
  
      this.http.patch(url, payload, { headers }).subscribe(
        (response) => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Departamento atualizado com sucesso!' });
          // Atualiza a lista de funcionários para refletir a mudança
          this.fetchEmployees();
        },
        (error) => {
          console.error('Erro ao atualizar departamento do usuário', error);
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao atualizar departamento do usuário!' });
        }
      );
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Por favor, selecione um funcionário e um departamento.' });
    }
  }
  
  redirectToReset() {
    this.router.navigate(['/reset']);
  }

  deleteUser() {
    if (this.selectedUserToDelete) {
      const headers = this.getAuthHeaders();
      const url = `http://localhost:8081/user/${this.selectedUserToDelete.value}`; // Assumindo que `value` é o ID do funcionário
  
      this.http.delete(url, { headers }).subscribe(
        (response) => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Funcionário excluído com sucesso!' });
          // Atualiza a lista de funcionários após exclusão
          this.fetchEmployees();
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