import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auth, signInWithPopup, GoogleAuthProvider, deleteUser } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface User {
  //guardar datos de los usuarios
  id?: string;
  username: string;
  email: string;
  password?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8080/usuarios'; //url del endpoint

  constructor(private auth: Auth, private router: Router, private http: HttpClient) {}

  // Obtener un usuario por su email
  getUserByEmail(email: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/email/${email}`);
  }

  // Registrar un nuevo usuario
  registerUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  // Actualizar la contraseña de un usuario
  updatePassword(email: string, newPassword: string): Observable<string> {
    const params = new HttpParams()
      .set('email', email)
      .set('newPassword', newPassword);

    return this.http.patch(`${this.apiUrl}/password`, {}, {
      params,
      responseType: 'text'
    });
  }

  deleteUser(email: string): Observable<void> {
    const url = `${this.apiUrl}/email/${email}`;
    return this.http.delete<void>(url).pipe(
      catchError((error: any) => {
        console.error('Error al eliminar el usuario:', error);
        return throwError(() => new Error('Error al eliminar el usuario.'));
      })
    );
  }
  //borrar usuario de firebase
  async deleteFirebaseUser(): Promise<void> {
    try {
      const currentUser = this.auth.currentUser; //usuario
      if (currentUser) {
        await deleteUser(currentUser);
        console.log('Cuenta de Firebase eliminada exitosamente.');
      } else {
        throw new Error('No se encontró un usuario autenticado en Firebase.');
      }
    } catch (error) {
      console.error('Error al eliminar la cuenta de Firebase:', error);
      throw error;
    }
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
  // borrar usuario con firebase
  getCurrentUser() {
    return this.auth.currentUser;
  }
}
