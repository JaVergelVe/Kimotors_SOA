import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';
import { User as FirebaseUser } from '@angular/fire/auth';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
})
export class UserProfileComponent implements OnInit {
  user: User | FirebaseUser | null = null;
  username: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.getUserInfo();
  }

  getUserInfo(): void {
    // 🔍 Intentamos obtener el usuario autenticado de Firebase (Google)
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.user = currentUser;

      // ✅ Si es un usuario de Google (Firebase), usamos displayName
      if ('displayName' in currentUser) {
        this.username = currentUser.displayName || 'Usuario de Google';
      }

      return;
    }

    // 📦 Si no es un usuario de Google, buscamos en localStorage (correo/contraseña)
    const localUser = localStorage.getItem('currentUser');
    if (localUser) {
      const parsedUser: User = JSON.parse(localUser);
      this.user = parsedUser;
      this.username = parsedUser.username; // Mostramos el username del backend
      return;
    }

    // 🚫 Si no hay un usuario autenticado, redirigimos al login
    console.warn('No hay un usuario autenticado.');
    this.router.navigate(['/login']);
  }

  async logout(): Promise<void> {
    await this.authService.logout();
    localStorage.removeItem('currentUser'); // Limpiar el usuario almacenado
    this.router.navigate(['/']);
  }

  navigateToHome() {
    this.router.navigate(['/']);
  }
}