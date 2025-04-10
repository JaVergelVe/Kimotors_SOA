import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
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

  constructor(private auth: Auth, private http: HttpClient) {}

  // Obtener un usuario por su email
  getUserByEmail(email: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/email/${email}`);
  }

  // Validar si la contrasena corresponde al email
  login(email: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/login`, { email, password });
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

  getCurrentUser() {
    return this.auth.currentUser;
  }
}
