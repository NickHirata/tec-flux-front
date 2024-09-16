import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { Router } from '@angular/router'; 
import { DropdownModule } from 'primeng/dropdown';  // Importando o DropdownModule
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

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
    DropdownModule,

  ],
  providers: [provideNgxMask(), MessageService],
  templateUrl: './funcionarios.component.html',
  styleUrls: ['./funcionarios.component.scss'],
})

export class FuncionariosComponent implements OnInit {
  employeeDialog: boolean = false;
  employees: any[] = [];
  userForm: FormGroup;
  roles = [
    { label: 'Funcionário', value: ['ROLE_USUARIO'] },
    { label: 'Técnico de T.I', value: ['ROLE_TECNICO'] },
    { label: 'Gestor', value: ['ROLE_ADMINISTRADOR'] }
  ];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private messageService: MessageService
  ) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      departmentId: [1,],
      companyId: [1, ],
      role: [[], Validators.required]
    });
  }

  ngOnInit() {
    this.loadEmployees();
  }

  loadEmployees() {
    // Chamada para carregar funcionários (simulada)
    this.http.get<any[]>('http://localhost:8081/employees').subscribe(data => {
      this.employees = data;
    });
  }

  openEmployeeDialog() {
    this.userForm.reset();
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
      this.http.post('http://localhost:8081/auth/signup', this.userForm.value)
        .subscribe(
          response => {
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Funcionário cadastrado com sucesso!' });
            this.userForm.reset();
            this.loadEmployees();  // Recarrega a lista de funcionários
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