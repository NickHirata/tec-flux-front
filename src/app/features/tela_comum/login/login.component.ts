import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { PopupComponent } from '../app-popup/app-popup.component';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, PopupComponent, NgxMaskDirective, NgxMaskPipe],
  providers: [provideNgxMask()],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup;
  popupMessage: string = '';
  isError: boolean = false;
  showPopup: boolean = false;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.loginForm = this.fb.group({  
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.http.post('http://localhost:8081/auth/signin', this.loginForm.value).subscribe(
        (response) => {
          this.showPopupMessage('Login com sucesso!', false);
          this.loginForm.reset();
          setTimeout(() => {
            this.router.navigate(['/sistema/menu-inicial']);
          }, 3000);
        },
        (error) => {
          this.showPopupMessage('Usuário ou senha inválidos!', true);
        }
      );
    } else {
      this.markAllFieldsAsTouched();
    }
  }

  isFieldInvalid(field: string): boolean {
    const control = this.loginForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  markAllFieldsAsTouched() {
    this.loginForm.markAllAsTouched();
  }

  showPopupMessage(message: string, isError: boolean) {
    this.popupMessage = message;
    this.isError = isError;
    this.showPopup = true;

    // Força a renderização do pop-up
    setTimeout(() => {
      this.showPopup = false;
    }, 3000);
  }
}
