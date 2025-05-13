import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthFirebaseService } from '../../services/authFireBase.service';

@Component({
  selector: 'app-encabezado',
  imports: [RouterLink, CommonModule, RouterLinkActive],
  standalone: true,
  templateUrl: './encabezado.component.html',
  styleUrl: './encabezado.component.css'
})
export class EncabezadoComponent {
  constructor(
    private router: Router,
    private authFirebaseService: AuthFirebaseService
  ) {}

  get showLoginButton(): boolean {
    return !localStorage.getItem('currentUser') && !this.authFirebaseService.isAuthenticated;
  }

  handleAuthAction(event: MouseEvent): void {
    event.preventDefault();
    
    if (this.showLoginButton) {
      // Si no está autenticado, navegar a login
      this.router.navigate(['/login']);
    } else {
      // Si está autenticado, navegar al perfil
      this.router.navigate(['/user-profile']);
    }
  }
}