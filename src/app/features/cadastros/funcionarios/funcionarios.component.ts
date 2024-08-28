import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-funcionarios',
  standalone: true,
  imports: [   
    ReactiveFormsModule,
    DropdownModule,
    ButtonModule,
    InputTextModule
  ],
  templateUrl: './funcionarios.component.html',
  styleUrl: './funcionarios.component.scss'
})
export class FuncionariosComponent implements OnInit{

  userForm!: FormGroup;
  roles = [
    { label: 'Funcionário', value: 'employee' },
    { label: 'Administrador', value: 'admin' }
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      // Lógica para salvar os dados do usuário
      console.log(this.userForm.value);
    }
  }

}
