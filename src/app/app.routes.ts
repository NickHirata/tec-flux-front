import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './features/login/login.component';
import { UsuarioComponent } from './features/cadastros/usuario/usuario.component';
import { EmpresaComponent } from './features/cadastros/empresa/empresa.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { SidebarComponent } from './features/sidebar/sidebar.component';
import { HeaderComponent } from './features/header/header.component';
import { SobreNosComponent } from './features/sobre-nos/sobre-nos.component';
import { FaqComponent } from './features/faq/faq.component';
import { TrabalheConoscoComponent } from './features/trabalhe-conosco/trabalhe-conosco.component';
import { MenuInicialComponent } from './features/menu-inicial/menu-inicial.component';
import { AbrirChamadoComponent } from './features/cadastros/abrir-chamado/abrir-chamado.component';
import { LayoutSistemaComponent } from './shared/layout-sistema/layout-sistema.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'cad_usuario', component: UsuarioComponent },
  { path: 'cad_empresa', component: EmpresaComponent },
  { path: 'sobre-nos', component: SobreNosComponent },
  { path: 'faq', component: FaqComponent },
  { path: 'trabalhe-conosco', component: TrabalheConoscoComponent },
  {
    path: 'sistema', component: LayoutSistemaComponent,
    children: [
      { path: '', redirectTo: 'menu-inicial', pathMatch: 'full' },
      { path: 'menu-inicial', component: MenuInicialComponent },
      { path: 'abrir-chamado', component: AbrirChamadoComponent }
      // { path: 'reportar-problema', component: },
      // { path: 'ajuda-codigo', component:  },
      // { path: 'problemas-hardware', component:  }
    ]
  },
  {path: 'dashboard', component: DashboardComponent},
  {path: 'sidebar', component:SidebarComponent},
  {path: 'header', component:HeaderComponent}
]
