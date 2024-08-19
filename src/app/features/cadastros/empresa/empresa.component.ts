import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { PopupComponent } from '../../app-popup/app-popup.component';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';

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
  popupMessage: string = '';
  isError: boolean = false;
  showPopup: boolean = false;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.empresaForm = this.fb.group({
      name: ['', Validators.required],
      cnpj: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.empresaForm.valid) {
      this.http.post('http://localhost:8081/company', this.empresaForm.value).subscribe(
        (response) => {
          this.showPopupMessage('Empresa cadastrada com sucesso!', false);
          this.empresaForm.reset();
        },
        (error) => {
          this.showPopupMessage('Erro ao cadastrar empresa', true);
        }
      );
    }
  }

  isFieldInvalid(field: string): boolean {
    const control = this.empresaForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  markAllFieldsAsTouched() {
    this.empresaForm.markAllAsTouched();
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
