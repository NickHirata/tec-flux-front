import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './features/login/login.component';
import { UsuarioComponent } from './features/cadastros/usuario/usuario.component';
import { EmpresaComponent } from './features/cadastros/empresa/empresa.component';
import { SobreNosComponent } from './features/sobre-nos/sobre-nos.component';
import { FaqComponent } from './features/faq/faq.component';
import { TrabalheConoscoComponent } from './features/trabalhe-conosco/trabalhe-conosco.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'cad_usuario', component: UsuarioComponent },
  { path: 'cad_empresa', component: EmpresaComponent },
  { path: 'sobre-nos', component: SobreNosComponent },
  { path: 'faq', component: FaqComponent },
  { path: 'trabalhe-conosco', component: TrabalheConoscoComponent }
];