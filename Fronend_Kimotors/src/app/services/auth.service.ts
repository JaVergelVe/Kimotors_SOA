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

export interface LoginRecord {
  username: string;
  email: string;
  provider: string;
  loginTimestamp: Date;
  activityType: 'login' | 'logout';
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8080/usuarios'; //url del endpoint

  constructor(private auth: Auth, private http: HttpClient) {}

  // Validar si la contrasena corresponde al email
  login(email: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/login`, { email, password });
  }  

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

  getCurrentUser() {
    return this.auth.currentUser;
  }

  private formatDateTime(date: Date): string {
    const pad = (num: number) => num.toString().padStart(2, '0');
    
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }
  
  registerLoginActivity(loginRecord: LoginRecord): Observable<any> {
    // Formatea la fecha a un string con el formato deseado
    const formattedRecord = {
        ...loginRecord,
        loginTimestamp: this.formatDateTime(loginRecord.loginTimestamp)
    };
    return this.http.post(`http://localhost:8080/api/login-records`, formattedRecord);
  }
}
