import { Injectable } from '@angular/core';
import { Auth, signInWithPopup, GoogleAuthProvider, deleteUser, FacebookAuthProvider, GithubAuthProvider, sendPasswordResetEmail, confirmPasswordReset } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { from, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthFirebaseService {

  constructor(private auth: Auth, private router: Router) {}

  // Iniciar sesión con Google
  async loginWithGoogle(): Promise<void> {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(this.auth, provider);
      console.log('Usuario autenticado con Google:', result.user);
      this.router.navigate(['/home']);
    } catch (error) {
      console.error('Error al autenticar con Google:', error);
    }
  }
  
  // Iniciar sesión con Facebook
  async loginWithFacebook(): Promise<void> {
    try {
      const provider = new FacebookAuthProvider();
      const result = await signInWithPopup(this.auth, provider);
      console.log('Usuario autenticado con Facebook:', result.user);
      this.router.navigate(['/home']);
    } catch (error) {
      console.error('Error al autenticar con Facebook:', error);
    }
  }

  // Iniciar sesión con GitHub
  async loginWithGithub(): Promise<void> {
    try {
      const provider = new GithubAuthProvider();
      const result = await signInWithPopup(this.auth, provider);
      console.log('Usuario autenticado con GitHub:', result.user);
      this.router.navigate(['/home']);
    } catch (error) {
      console.error('Error al autenticar con GitHub:', error);
    }
  }

  // Obtener el usuario actual autenticado en Firebase
  getCurrentUser() {
    return this.auth.currentUser;
  }

  // Cerrar sesión en Firebase
  async logout(): Promise<void> {
    try {
      await this.auth.signOut();
      console.log('Sesión cerrada exitosamente');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }

  // Eliminar cuenta de Firebase
  async deleteFirebaseUser(): Promise<void> {
    try {
      const currentUser = this.auth.currentUser;
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

  // Actualizar la contraseña de un usuario
  async sendPasswordResetEmail(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(this.auth, email);
      console.log('Correo de restablecimiento enviado correctamente');
    } catch (error) {
      console.error('Error al enviar el correo de restablecimiento:', error);
      throw error;
    }
  }

  // Método para restablecer contraseña con Firebase usando oobCode
  resetPasswordWithFirebase(oobCode: string, newPassword: string): Observable<void> {
    return from(confirmPasswordReset(this.auth, oobCode, newPassword));
  }
}