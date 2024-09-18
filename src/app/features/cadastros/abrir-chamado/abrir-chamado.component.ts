import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TableModule } from 'primeng/table';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { InputMaskModule } from 'primeng/inputmask';
import { TaskService } from '../../../shared/task.service';
import { CadastroService } from '../../../services/cadastro.service'; // Ajuste o caminho conforme necessário
import { CommonModule } from '@angular/common'; // Adicionado

@Component({
  selector: 'app-abrir-chamado',
  standalone: true,
  imports: [ 
    CommonModule, // Adicionado
    TableModule,
    FileUploadModule,
    FormsModule,
    ButtonModule,
    RippleModule,
    ToastModule,
    ToolbarModule,
    RatingModule,
    InputTextModule,
    InputTextareaModule,
    DropdownModule,
    RadioButtonModule,
    InputNumberModule,
    DialogModule,
    InputMaskModule
  ],
  templateUrl: './abrir-chamado.component.html',
  styleUrls: ['./abrir-chamado.component.scss']
})
export class AbrirChamadoComponent implements OnInit {
  
  chamados: any[] = [];
  chamado: any = {};
  chamadoDialog: boolean = false;
  submitted: boolean = false;

  departamentos: any[] = [];
  categorias: any[] = [];

  constructor(
    private http: HttpClient, // Injetado
    private cadastroService: CadastroService, 
    private taskService: TaskService
  ) {}

  ngOnInit() {
    this.loadDepartamentos();
    this.loadCategorias();
    this.loadChamados();
  }

  // Método loadCategorias sem parâmetros corrigido
  loadCategorias() {
    this.cadastroService.getCategorias().subscribe(
      (data) => {
        this.categorias = data;
      },
      (error) => {
        console.error('Erro ao carregar categorias', error);
      }
    );
  }

  loadDepartamentos() {
    this.http.get<any[]>('http://localhost:8081/departments').subscribe(
      (data) => {
        this.departamentos = data;
      },
      (error) => {
        console.error('Erro ao carregar departamentos', error);
      }
    );
  }

  // Renomeado para evitar duplicação
  loadCategoriasByDepartamento(departamentoId: number) {
    this.http.get<any[]>(`http://localhost:8081/departments/${departamentoId}/categories`).subscribe(
      (data) => {
        this.categorias = data;
      },
      (error) => {
        console.error('Erro ao carregar categorias', error);
      }
    );
  }

  loadChamados() {
    this.http.get<any[]>('http://localhost:8081/chamados').subscribe(
      (data) => {
        this.chamados = data;
      },
      (error) => {
        console.error('Erro ao carregar chamados', error);
      }
    );
  }

  // Corrigido o nome do método
  openChamadoDialog() {
    this.chamado = {};
    this.submitted = false;
    this.chamadoDialog = true;
  }

  onDepartamentoChange(event: any) {
    const departamentoSelecionado = event.value;
    if (departamentoSelecionado && departamentoSelecionado.id) {
      this.loadCategoriasByDepartamento(departamentoSelecionado.id);
    } else {
      this.categorias = [];
    }
  }

  salvarChamado() { 
    this.submitted = true;

    if (this.chamado.departamento && this.chamado.categoria && this.chamado.assunto && this.chamado.descricao) {
      const chamadoData = {
        departamentoId: this.chamado.departamento.id,
        categoriaId: this.chamado.categoria.id,
        assunto: this.chamado.assunto,
        descricao: this.chamado.descricao
      };
      this.http.post<any>('http://localhost:8081/chamados', chamadoData).subscribe(
        (response) => {
          this.chamados.push(response);
          this.chamadoDialog = false;
          this.chamado = {};
        },
        (error) => {
          console.error('Erro ao salvar chamado', error);
        }
      );
    }
  }

  hideDialog() {
    this.chamadoDialog = false;
    this.submitted = false;
  }
}
