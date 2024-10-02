import { Routes } from '@angular/router';
import { HomeComponent } from './features/tela_comum/home/home.component';
import { LoginComponent } from './features/tela_comum/login/login.component';
import { UsuarioComponent } from './features/cadastros/usuario/usuario.component';
import { EmpresaComponent } from './features/cadastros/empresa/empresa.component';
import { DashboardComponent } from './features/administrador/dashboard/dashboard.component';
import { SobreNosComponent } from './features/tela_comum/sobre-nos/sobre-nos.component';
import { FaqComponent } from './features/tela_comum/faq/faq.component';
import { TrabalheConoscoComponent } from './features/tela_comum/trabalhe-conosco/trabalhe-conosco.component';
import { MenuInicialComponent } from './features/usuarios/menu-inicial/menu-inicial.component';
import { AbrirChamadoComponent } from './features/cadastros/abrir-chamado/abrir-chamado.component';
import { LayoutSistemaComponent } from './shared/layout-sistema/layout-sistema.component';
import { ChatbotComponent } from './features/chatbot/chatbot.component';
import { FuncionariosComponent } from './features/cadastros/funcionarios/funcionarios.component';
import { GraficosComponent } from './features/administrador/graficos/graficos.component';
import { KanbanBoardComponent } from './features/kanban-board/kanban-board.component';
import { SetoresComponent } from './features/administrador/setores/setores.component';
import { ConfiguracaoComponent } from './features/administrador/configuracao/configuracao.component';
import { ConfigComponent } from './features/usuarios/config/config.component';
import { ResetPasswordComponent } from './features/tela_comum/reset-password/reset-password.component';
export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'cad_adm', component: UsuarioComponent },
  { path: 'cad_empresa', component: EmpresaComponent },
  { path: 'sobre-nos', component: SobreNosComponent },
  { path: 'faq', component: FaqComponent },
  { path: 'trabalhe-conosco', component: TrabalheConoscoComponent },
  { path: 'board', component:KanbanBoardComponent},
  { path: 'reset', component:ResetPasswordComponent},
  {
    path: 'sistema', component: LayoutSistemaComponent,
    children: [
      { path: '', redirectTo: 'menu-inicial', pathMatch: 'full' },
      { path: 'menu-inicial', component: MenuInicialComponent },
      { path: 'abrir-chamado', component: AbrirChamadoComponent },
      { path: 'chatbot', component:ChatbotComponent},
      { path: 'board', component:KanbanBoardComponent},
      { path: 'config', component:ConfigComponent}
    ]
  },
  {
    path: 'empresa', component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: GraficosComponent },
      { path: 'abrir-chamado', component: AbrirChamadoComponent },
      { path: 'chatbot', component:ChatbotComponent},
      { path: 'cad_func', component:FuncionariosComponent},
      { path: 'board', component:KanbanBoardComponent},
      { path: 'setores', component:SetoresComponent},
      { path: 'config', component:ConfiguracaoComponent},
    ]
  },
]