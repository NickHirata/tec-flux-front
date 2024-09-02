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
      password: ['', Validators.required]
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

  onSubmitEmpresa() {
    if (this.empresaForm.valid) {
      this.http.post('http://localhost:8081/company', this.empresaForm.value).subscribe(
        (response) => {
          this.showPopupMessage('Empresa cadastrada com sucesso!', false);
          this.isAdminStep = true;  // Avança para o cadastro do administrador
        },
        (error) => {
          this.showPopupMessage('Erro ao cadastrar empresa', true);
        }
      );
    } else {
      this.showPopupMessage('Por favor, preencha todos os campos corretamente.', true);
      this.markAllFieldsAsTouched();
    }
  }

  onSubmitAdmin() {
    if (this.adminForm.valid) {
      this.http.post('http://localhost:8081/admin', this.adminForm.value).subscribe(
        (response) => {
          this.showPopupMessage('Administrador cadastrado com sucesso!', false);
          this.router.navigate(['/dashboard']);  // Redireciona para o dashboard
        },
        (error) => {
          this.showPopupMessage('Erro ao cadastrar administrador', true);
        }
      );
    } else {
      this.showPopupMessage('Por favor, preencha todos os campos corretamente.', true);
      this.markAllFieldsAsTouched();
    }
  } 
}
