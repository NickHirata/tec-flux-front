import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { PopupComponent } from '../../../shared/app-popup/app-popup.component';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { Router } from '@angular/router';

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
  isCompanyDataFilled: boolean = false;

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
      companyId: [''],
      departmentId: [''],
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

  // Método para buscar os dados da empresa ao perder o foco no campo CNPJ
  onCnpjBlur() {
    const cnpj = this.empresaForm.get('cnpj')?.value;

    if (cnpj) {
      // Remove caracteres especiais do CNPJ
      const cleanedCnpj = cnpj.replace(/[^\d]+/g, '');

      // Faz a requisição para buscar os dados da empresa pelo CNPJ
      this.http.get(`http://localhost:8081/company/cnpj/${cleanedCnpj}`).subscribe(
        (response: any) => {
          // Se a empresa existir, preenche os outros campos do formulário
          if (response) {
            this.empresaForm.patchValue({
              name: response.name || '',
              address: response.address || '',
              phone: response.phone || ''
            });

            this.isCompanyDataFilled = true; // Marca que os dados foram preenchidos
            this.showPopupMessage('Dados da empresa preenchidos com sucesso!', false);
          } else {
            this.isCompanyDataFilled = false; // Marca que os dados não foram encontrados
            this.showPopupMessage('CNPJ não encontrado!', true);
          }
        },
        (error) => {
          this.isCompanyDataFilled = false; // Marca que houve um erro na busca dos dados
          this.showPopupMessage('Erro ao buscar os dados da empresa!', true);
        }
      );
    }
  }

  // Método para cadastrar empresa e administrador
  onSubmitEmpresa() {
    if (this.empresaForm.valid) {
      // Remove caracteres especiais do CNPJ
      const cnpj = this.empresaForm.get('cnpj')?.value.replace(/[^\d]+/g, '');

      // Verifica se o CNPJ já está cadastrado
      this.http.get(`http://localhost:8081/company/cnpj/${cnpj}`).subscribe(
        (response: any) => {
          if (response && response.message === 'Empresa já cadastrada') {
            this.showPopupMessage('CNPJ já cadastrado!', true);
          } else {
            // Cadastrar a empresa se o CNPJ não estiver cadastrado
            this.http.post('http://localhost:8081/company', this.empresaForm.value).subscribe(
              (empresaResponse: any) => {
                // Certifique-se de que 'id' está presente na resposta
                const companyId = empresaResponse.id;
                if (companyId) {
                  // Passa o companyId para o formulário do administrador
                  this.adminForm.patchValue({ companyId });

                  this.isAdminStep = true; // Avança para o cadastro do administrador
                  this.showPopupMessage('Empresa cadastrada com sucesso. Agora cadastre o administrador.', false);
                } else {
                  this.showPopupMessage('Erro: ID da empresa não retornado!', true);
                }
              },
              (error) => {
                this.showPopupMessage('Erro ao cadastrar empresa!', true);
              }
            );
          }
        },
        (error) => {
          this.showPopupMessage('Erro ao verificar CNPJ!', true);
        }
      );
    } else {
      this.showPopupMessage('Por favor, preencha todos os campos corretamente.', true);
      this.markAllFieldsAsTouched();
    }
  }


  // Método para cadastrar o administrador
  onSubmitAdmin() {
    if (this.adminForm.valid) {
      // Faz o cadastro do administrador
      this.http.post('http://localhost:8081/auth/signup', this.adminForm.value).subscribe(
        (response) => {
          this.showPopupMessage('Empresa e administrador cadastrados com sucesso!', false);

          // Redireciona após sucesso
          setTimeout(() => {
            this.router.navigate(['empresa/dashboard']);
          }, 2000);
        },
        (error) => {
          this.showPopupMessage('Erro ao cadastrar administrador!', true);
        }
      );
    } else {
      this.showPopupMessage('Por favor, preencha todos os campos corretamente.', true);
      this.markAllFieldsAsTouched();
    }
  }
}
