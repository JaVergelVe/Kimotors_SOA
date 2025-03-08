import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { VersusComponent } from './versus/versus.component';

export const routes: Routes = [
  { path: '', component: MainPageComponent,pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'versus', component: VersusComponent },
  { path: 'register', component: RegisterComponent },
  { path: '**', redirectTo: '' }
];
