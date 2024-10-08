import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { PopupComponent } from '../../../shared/app-popup/app-popup.component';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { Router } from '@angular/router';
import { Console } from 'console';

@Component({
  selector: 'app-empresa',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, PopupComponent, NgxMaskDirective, NgxMaskPipe],
  providers: [provideNgxMask()],
  templateUrl: './empresa.component.html',
  styleUrls: ['./empresa.component.scss'],
})
export class EmpresaComponent {
  empresaForm: FormGroup;
  adminForm: FormGroup;
  popupMessage: string = '';
  isError: boolean = false;
  showPopup: boolean = false;
  isAdminStep = false;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.empresaForm = this.fb.group({
      name: ['', Validators.required],
      cnpj: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', Validators.required],
    });

    this.adminForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      phone: ['', Validators.required],
      companyId: ['', Validators.required],
      departmentId: ['', Validators.required],
      roles: [['ROLE_ADMINISTRADOR'], Validators.required]
    });
  }

  isFieldInvalid(field: string): boolean {
    const control = this.isAdminStep ? this.adminForm.get(field) : this.empresaForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  markAllFieldsAsTouched() {
    if (this.isAdminStep) {
      this.adminForm.markAllAsTouched();
    } else {
      this.empresaForm.markAllAsTouched();
    }
  }

  showPopupMessage(message: string, isError: boolean) {
    this.popupMessage = message;
    this.isError = isError;
    this.showPopup = true;

    setTimeout(() => {
      this.showPopup = false;
    }, 2000);
  }

// Método para verificar se o CNPJ já está cadastrado
checkCnpjExists(cnpj: string) {
  // Ajuste da URL conforme seu endpoint
  return this.http.get(`http://localhost:8081/company/cnpj/?cnpj=${cnpj}`);
}

onSubmitEmpresa() {
  if (this.empresaForm.valid) {
    // Captura o valor do CNPJ do formulário
    let cnpj = this.empresaForm.get('cnpj')?.value;

    // Remove caracteres especiais do CNPJ
    cnpj = cnpj.replace(/[^\d]+/g, '');

    // Faz a requisição para verificar se o CNPJ existe
    this.http.get(`http://localhost:8081/company/cnpj/${cnpj}`).subscribe(
      (response: any) => {
        // Log da resposta para garantir que estamos vendo o retorno correto
        console.log(response);

        // Verifica se a mensagem indica que a empresa já está cadastrada
        if (response && response.message && response.message === 'Empresa já cadastrada') {
          // Mostra a mensagem de erro se o CNPJ já estiver cadastrado
          this.showPopupMessage('CNPJ já cadastrado!', true);
        } else {
          // Se a mensagem não indicar isso, avança para a próxima etapa
          this.isAdminStep = true;
        }
      },
      (error) => {
        // Mostra uma mensagem de erro se houver um problema com a requisição
        this.showPopupMessage('Erro ao verificar CNPJ!', true);
      }
    );
  } else {
    this.showPopupMessage('Por favor, preencha todos os campos corretamente.', true);
    this.markAllFieldsAsTouched();
  }
}

  
  onSubmitAdmin() {
    if (this.adminForm.valid) {
      this.http.post('http://localhost:8081/auth/signup', this.adminForm.value).subscribe(
        (response) => {
          // Se o administrador for cadastrado com sucesso, cadastra a empresa
          this.http.post('http://localhost:8081/company', this.empresaForm.value).subscribe(
            (response) => {
              this.showPopupMessage('Empresa e administrador cadastrados com sucesso!', false);
  
              // Adicionando um delay de 2 segundos antes de redirecionar
              setTimeout(() => {
                this.router.navigate(['empresa/dashboard']);
              }, 2000);
            },
            (error) => {
              this.showPopupMessage('Erro ao cadastrar empresa!', true);
            }
          );
        },
        (error) => {
          this.showPopupMessage('Email de administrador já cadastrado!', true);
        }
      );
    } else {
      this.showPopupMessage('Por favor, preencha todos os campos corretamente.', true);
      this.markAllFieldsAsTouched();
    }
  }  
}
