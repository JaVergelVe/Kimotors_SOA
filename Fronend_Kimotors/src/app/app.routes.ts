import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { VersusComponent } from './components/versus/versus.component';
import { VistaMotoComponent } from './components/vista-moto/vista-moto.component';
import { EncabezadoComponent } from './components/encabezado/encabezado.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';

export const routes: Routes = [
  { path: '', component: MainPageComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'versus', component: VersusComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'encabezado', component: EncabezadoComponent },
  { path: 'vista-moto', component: VistaMotoComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'user-porfile', component: UserProfileComponent },
  { path: '**', redirectTo: '' }
];
