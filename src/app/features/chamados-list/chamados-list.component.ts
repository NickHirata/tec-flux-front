import { Component, OnInit } from '@angular/core';
import { CadastroService } from '../../services/cadastro.service'

@Component({
  selector: 'app-chamados-list',
  templateUrl: './chamados-list.component.html',
  styleUrls: ['./chamados-list.component.scss']
})
export class ChamadosListComponent implements OnInit {
  chamados: any[] = [];
  userId: string = '123'; // Coloque o ID do usuário logado aqui

  constructor(private cadastroService: CadastroService) {}

  ngOnInit() {
    this.loadChamados();
  }

  loadChamados() {
    this.cadastroService.getChamadosByUser(this.userId).subscribe(
      (data) => {
        this.chamados = data;
      },
      (error) => {
        console.error('Erro ao carregar chamados', error);
      }
    );
  }

  viewResolution(chamado: any) {
    // Código para abrir o popup com a resolução
  }
}
