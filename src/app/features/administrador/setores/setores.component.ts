import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ToolbarModule } from 'primeng/toolbar';

@Component({
  selector: 'app-setores',
  standalone: true,
  imports: [
    ReactiveFormsModule, 
    CommonModule, 
    ToastModule, 
    TableModule, 
    DialogModule, 
    ButtonModule,
    ToolbarModule  
  ],
  providers: [MessageService],
  templateUrl: './setores.component.html',
  styleUrls: ['./setores.component.scss']
})
export class SetoresComponent {
  setorForm: FormGroup;
  setores: any[] = [];
  setorDialog: boolean = false;

  constructor(
    private fb: FormBuilder, 
    private http: HttpClient, 
    private messageService: MessageService
  ) {
    this.setorForm = this.fb.group({
      companyId: [1, Validators.required],  // Company ID fixo ou dinâmico
      name: ['', Validators.required],
      description: ['', Validators.required]  // Valor padrão ou dinâmico
    });
  }

  openSetorDialog() {
    this.setorForm.reset({ companyId: 1, description: '' });  // Reseta o formulário com valores padrões
    this.setorDialog = true;
  }

  hideDialog() {
    this.setorDialog = false;
  }

  onSubmitSetor() {
    if (this.setorForm.valid) {
      this.http.post('http://localhost:8081/departments', this.setorForm.value).subscribe(
        (response) => {
          this.setores.push(response);  // Atualiza a lista de setores
          this.setorDialog = false;     // Fecha o diálogo
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Setor cadastrado com sucesso!' });
        },
        (error) => {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao cadastrar setor!' });
        }
      );
    } else {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Por favor, preencha todos os campos corretamente.' });
    }
  }
}
