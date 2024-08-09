import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './features/login/login.component';
import { UsuarioComponent } from './features/cadastros/usuario/usuario.component';

export const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path:'home', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'cad_usuario', component: UsuarioComponent}
];
