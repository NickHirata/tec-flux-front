import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ToolbarModule } from 'primeng/toolbar';
import { DropdownModule } from 'primeng/dropdown';
import { ReactiveFormsModule } from '@angular/forms';

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

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private messageService: MessageService
  ) {
    // Inicializa o formulário
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      departmentId: [1, Validators.required],  // Padrão fixo ou pode ser dinâmico
      companyId: [1, Validators.required],     // Padrão fixo ou pode ser dinâmico
      role: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.getEmployees();
  }

  getEmployees() {
    // Simulação de dados, substitua por um GET real em uma API
    this.employees = [
      { name: 'João Silva', email: 'joao@empresa.com', role: { label: 'Técnico de T.I' } },
      { name: 'Maria Souza', email: 'maria@empresa.com', role: { label: 'Gestor' } }
    ];
  }

  openEmployeeDialog() {
    this.userForm.reset({ departmentId: 1, companyId: 1, role: null });  // Reseta o formulário com valores padrão
    this.employeeDialog = true;
  }

  hideDialog() {
    this.employeeDialog = false;
  }

  salvarFuncionario() {
    if (this.userForm.valid) {
      const newEmployee = this.userForm.value;
      
      // Define o token de forma correta, passando no cabeçalho 'Authorization'
      const token = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI4eXhmNnBDK0pYeFAyQWk3NVRVWG5lVlpMTW9YK3NtQyIsImlhdCI6MTcyNzI4OTcyMSwiZXhwIjoxNzI3Mjk2OTIxfQ.ws6dOyTTAtzwyzA2wZkDe3a-KbkOuSLzHBrdGfDxfoMNthNIplJTfwuczLei9GuPdOMD8X_i96mMqDV5BNILfQ';  // Aqui, substitua pelo seu token real
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      this.http.post('http://localhost:8081/user/register', newEmployee, { headers }).subscribe(
        (response) => {
          this.employees.push(response);  // Adiciona o novo funcionário à lista
          this.employeeDialog = false;    // Fecha o diálogo
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Funcionário cadastrado com sucesso!' });
        },
        (error) => {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao cadastrar funcionário.' });
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
