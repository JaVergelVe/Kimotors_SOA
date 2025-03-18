import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auth, signInWithPopup, GoogleAuthProvider } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

export interface User {
  id?: string;
  username: string;
  email: string;
  password?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8080/usuarios';

  constructor(private auth: Auth, private router: Router, private http: HttpClient) {}

  // 🔹 Obtener un usuario por su email
  getUserByEmail(email: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/email/${email}`);
  }

  // 🔹 Registrar un nuevo usuario
  registerUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  // 🔹 Actualizar la contraseña de un usuario
  updatePassword(email: string, newPassword: string): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/update-password`, {
      email,
      newPassword,
    });
  }

  // Iniciar sesión con Google
  async loginWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(this.auth, provider);
      console.log('Usuario autenticado con Google:', result.user);
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Error al autenticar con Google:', error);
    }
  }

  // Cerrar sesion
  async logout(): Promise<void> {
    try {
      await this.auth.signOut();
      console.log('Sesión cerrada exitosamente');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }

  getCurrentUser() {
    return this.auth.currentUser;
  }
}