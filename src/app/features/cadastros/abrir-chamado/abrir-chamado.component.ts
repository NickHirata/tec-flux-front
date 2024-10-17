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
import { CommonModule } from '@angular/common';
import { PanelModule } from 'primeng/panel';

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
    InputMaskModule,
    PanelModule
  ],
  templateUrl: './abrir-chamado.component.html',
  styleUrls: ['./abrir-chamado.component.scss']
})
export class AbrirChamadoComponent implements OnInit {

  chamados: any[] = [];
  chamado: any = {};
  chamadoDialog: boolean = false;
  submitted: boolean = false;

  detalheDialog: boolean = false;
  selectedChamado: any;


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
    this.loadChamadosTestData();
  }
  attachedItems: any[] = []; // Inicializa a lista de itens anexados

  onFileUpload(event: any) {
    for (let file of event.files) {
      this.attachedItems.push(file);
    }
  }

  // Método para carregar chamados de teste
  loadChamadosTestData() {
    this.chamados = [
      {
        id: 1,
        nome: 'Problema no servidor',
        prioridade: 'Alta',
        progresso: 50,
        status: 'Em andamento',
        departamento: { id: 1, nome: 'TI' },
        categoria: { id: 1, nome: 'Hardware' },
        assunto: 'Falha no servidor de produção',
        descricao: 'O servidor está apresentando falhas intermitentes desde a última atualização.',
        dataCriacao: '2024-09-01',
        dataResolucao: null,
        historico: [
          { data: '2024-09-02', responsavel: 'João', descricao: 'Investigação inicial do problema.' },
          { data: '2024-09-03', responsavel: 'Maria', descricao: 'Reinicialização do servidor e aplicação de patch.' }
        ]
      },
      {
        id: 2,
        nome: 'Erro na aplicação web',
        prioridade: 'Média',
        progresso: 75,
        status: 'Em andamento',
        departamento: { id: 2, nome: 'Desenvolvimento' },
        categoria: { id: 2, nome: 'Software' },
        assunto: 'Aplicação web não carrega corretamente',
        descricao: 'Usuários relatam que a aplicação não carrega em determinados navegadores.',
        dataCriacao: '2024-09-05',
        dataResolucao: null,
        historico: [
          { data: '2024-09-06', responsavel: 'Carlos', descricao: 'Análise de compatibilidade com navegadores.' },
          { data: '2024-09-07', responsavel: 'Ana', descricao: 'Correção de bug na renderização.' }
        ]
      },
      {
        id: 3,
        nome: 'Atualização de sistema',
        prioridade: 'Baixa',
        progresso: 100,
        status: 'Resolvido',
        departamento: { id: 3, nome: 'Suporte' },
        categoria: { id: 3, nome: 'Infraestrutura' },
        assunto: 'Atualização do sistema de backup',
        descricao: 'Necessidade de atualizar o sistema de backup para a versão mais recente.',
        dataCriacao: '2024-08-25',
        dataResolucao: '2024-09-01',
        historico: [
          { data: '2024-08-26', responsavel: 'Pedro', descricao: 'Agendada atualização.' },
          { data: '2024-09-01', responsavel: 'Lucas', descricao: 'Atualização realizada com sucesso.' }
        ]
      }
    ];
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
    this.http.get<any[]>('http://localhost:8081/departments/1').subscribe(
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


  verDetalhes(chamado: any) {
    this.selectedChamado = chamado; // Armazena o chamado selecionado
    this.detalheDialog = true; // Abre o diálogo de detalhes
  }
}
