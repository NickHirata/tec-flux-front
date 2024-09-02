import { Component, OnInit } from '@angular/core';
import { CadastroService } from '../../../services/cadastro.service';
import { FormsModule } from '@angular/forms';
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

@Component({
  selector: 'app-abrir-chamado',
  standalone: true,
  imports: [ 
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
    InputMaskModule],
  templateUrl: './abrir-chamado.component.html',
  styleUrl: './abrir-chamado.component.scss'
})

export class AbrirChamadoComponent implements OnInit {
  
  chamados: any[] = [];
  chamado: any = {};
  chamadoDialog: boolean = false;
  submitted: boolean = false;

  departamentos: any[] = [];
  categorias: any[] = [];

  constructor(private cadastroService: CadastroService) {}

  ngOnInit() {
    this.loadDepartamentos();
    this.loadCategorias();
    this.loadChamados();
  }

  loadDepartamentos() {
    this.cadastroService.getDepartamentos().subscribe(
      (data) => {
        this.departamentos = data;
      },
      (error) => {
        console.error('Erro ao carregar departamentos', error);
      }
    );
  }

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

  loadChamados() {
    this.cadastroService.getChamados().subscribe(
      (data) => {
        this.chamados = data;
      },
      (error) => {
        console.error('Erro ao carregar chamados', error);
      }
    );
  }

  openChamadoDiolog() {
    this.chamado = {};
    this.submitted = false;
    this.chamadoDialog = true;
  }

  salvarChamado() {
    this.submitted = true;

    if (this.chamado.departamento && this.chamado.categoria && this.chamado.assunto && this.chamado.descricao) {
      this.cadastroService.salvarChamado(this.chamado).subscribe(
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
