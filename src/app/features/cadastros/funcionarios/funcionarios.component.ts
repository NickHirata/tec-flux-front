import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { Router } from '@angular/router'; 
import { DropdownModule } from 'primeng/dropdown';  // Importando o DropdownModule

@Component({
  selector: 'app-funcionarios',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    NgxMaskDirective,
    NgxMaskPipe,
    DropdownModule,  // Adicionando DropdownModule aos imports
  ],
  providers: [provideNgxMask()],
  templateUrl: './funcionarios.component.html',
  styleUrls: ['./funcionarios.component.scss'],
})

export class FuncionariosComponent {
  funcForm!: FormGroup;
  popupMessage: string = '';
  isError: boolean = false;
  showPopup: boolean = false;

  roles = [
    { label: 'Funcionário', value: 'ROLE_USUARIO' },
    { label: 'Técnico de T.I', value: 'ROLE_TECNICO' },
    { label: 'Gestor', value: 'ROLE_ADMINISTRADOR' }
  ];

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.funcForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      departmentId: [1, Validators.required],
      companyId: [1, Validators.required],
      role: ['', Validators.required]
    });
}

  onSubmitFunc() {
    if (this.funcForm.valid) {
      this.http.post('http://localhost:8081/user/register', this.funcForm.value).subscribe(
        (response) => {
          this.showPopupMessage('Funcionário cadastrado com sucesso!', false);
          
          // Adicionando um delay de 2 segundos antes de redirecionar
          setTimeout(() => {
            this.router.navigate(['empresa/dashboard']);  // Redireciona para o dashboard
          }, 2000);  // Delay de 2 segundos
        },
        (error) => {
          if (error.status === 400) {
            this.showPopupMessage('Email de funcionário já cadastrado ou erro de validação!', true);
          } else {
            this.showPopupMessage('Erro ao cadastrar funcionário!', true);
          }
        }
      );
    } else {
      this.showPopupMessage('Por favor, preencha todos os campos corretamente.', true);
      this.markAllFieldsAsTouched();  // Marcar todos os campos como "touched" para mostrar os erros de validação
    }
  }

  isFieldInvalid(field: string): boolean {
    const control = this.funcForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  markAllFieldsAsTouched() {
    this.funcForm.markAllAsTouched();
  }

  showPopupMessage(message: string, isError: boolean) {
    this.popupMessage = message;
    this.isError = isError;
    this.showPopup = true;

    setTimeout(() => {
      this.showPopup = false;
    }, 3000);
  }
}
