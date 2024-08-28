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

export class FuncionariosComponent implements OnInit {
  userForm!: FormGroup;
  popupMessage: string = '';
  isError: boolean = false;
  showPopup: boolean = false;

  roles = [
    { label: 'Funcionário', value: 'ROLE_USUARIO' },
    { label: 'Técnico de T.I', value: 'ROLE_TECNICO' },
    { label: 'Gestor', value: 'ROLE_ADMINISTRADOR' }
  ];

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      this.http.post('http://localhost:8081/auth/signup', this.userForm.value)
        .subscribe(
          response => {
            this.showPopupMessage('Funcionário cadastrado com sucesso!', false);
            console.log('Funcionário cadastrado com sucesso', response);
            this.userForm.reset();
          },
          error => {
            this.showPopupMessage('Erro ao cadastrar funcionário!', true);
            console.error('Erro ao cadastrar funcionário', error);
          }
        );
    } else {
      this.markAllFieldsAsTouched();
    }
  }

  isFieldInvalid(field: string): boolean {
    const control = this.userForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  markAllFieldsAsTouched() {
    this.userForm.markAllAsTouched();
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
