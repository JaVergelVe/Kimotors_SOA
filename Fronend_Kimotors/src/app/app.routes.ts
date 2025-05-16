import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { VersusComponent } from './components/versus/versus.component';
import { VistaMotoComponent } from './components/vista-moto/vista-moto.component';
import { EncabezadoComponent } from './components/encabezado/encabezado.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { TarjetaMotoComponent } from './components/tarjeta-moto/tarjeta-moto.component';
import { ResetPasswordManualComponent } from './components/reset-password-manual/reset-password-manual.component';
import { FavoritosComponent } from './components/favoritos/favoritos.component';

export const routes: Routes = [
  { path: '', component: MainPageComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'versus', component: VersusComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'encabezado', component: EncabezadoComponent },
  { path: 'moto/:marca/:modelo', component: VistaMotoComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password-manual', component: ResetPasswordManualComponent },
  { path: 'tarjeta-moto', component: TarjetaMotoComponent },
  { path: 'user-profile', component: UserProfileComponent },
  { path: 'favoritos', component: FavoritosComponent },
  { path: '**', redirectTo: '' }
];
