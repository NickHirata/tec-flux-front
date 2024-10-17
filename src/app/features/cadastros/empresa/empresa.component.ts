import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { PopupComponent } from '../../../shared/app-popup/app-popup.component';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-empresa',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, PopupComponent, NgxMaskDirective, NgxMaskPipe,  HttpClientModule, RouterModule,],
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
      companyName: ['', Validators.required],
      cnpj: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', Validators.required],
    });

    this.adminForm = this.fb.group({
      userName: ['', Validators.required],
      userEmail: ['', [Validators.required, Validators.email]],
      userPassword: ['', Validators.required],
      userPhone: ['', Validators.required],
      userPosition: ['', Validators.required],
      roles: [['ROLE_MASTER'], Validators.required],
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

  onCnpjBlur() {
    const cnpj = this.empresaForm.get('cnpj')?.value;
  
    if (cnpj) {
      const cleanedCnpj = cnpj.replace(/[^\d]+/g, '');
  
      console.log('CNPJ Limpo:', cleanedCnpj); // Log do CNPJ limpo
  
      this.http.get(`http://localhost:8081/company/cnpj/${cleanedCnpj}`).subscribe(
        (response: any) => {
          console.log('Resposta do servidor:', response); // Adicione este log
  
          if (response && (response.companyName || response.name)) {
            this.empresaForm.patchValue({
              companyName: response.companyName || response.name || '',
              address: response.address || '',
              phone: response.phone || ''
            });
  
            this.isCompanyDataFilled = true;
            this.showPopupMessage('Dados da empresa preenchidos com sucesso!', false);
          } else {
            this.isCompanyDataFilled = false;
            this.showPopupMessage('Empresa já cadastrada!', true);
          }
        },
        (error) => {
          console.error('Erro ao buscar dados da empresa:', error); // Log do erro
          this.isCompanyDataFilled = false;
          this.showPopupMessage('Erro ao buscar os dados da empresa!', true);
        }
      );
    }
  }  

  onSubmitEmpresa() {
    if (this.empresaForm.valid) {
      this.isAdminStep = true;
    } else {
      this.showPopupMessage('Por favor, preencha todos os campos corretamente.', true);
      this.markAllFieldsAsTouched();
    }
  }

  onSubmitAdmin() {
    if (this.adminForm.valid && this.empresaForm.valid) {
      const companyData = { ...this.empresaForm.value };
      const adminData = { ...this.adminForm.value };

      companyData.cnpj = companyData.cnpj.replace(/[^\d]+/g, '');

      const requestData = {
        ...companyData,
        ...adminData,
      };

      this.http.post('http://localhost:8081/company/create-with-department-user', requestData).subscribe(
        (response: any) => {
          this.showPopupMessage('Empresa e administrador cadastrados com sucesso!', false);

          // Redireciona após sucesso
          setTimeout(() => {
            this.router.navigate(['empresa/dashboard']);
          }, 2000);
        },
        (error) => {
          this.showPopupMessage('Erro ao cadastrar empresa e administrador!', true);
        }
      );
    } else {
      this.showPopupMessage('Por favor, preencha todos os campos corretamente.', true);
      this.markAllFieldsAsTouched();
    }
  }
}
