import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  GithubAuthProvider,
  deleteUser,
  sendPasswordResetEmail,
  confirmPasswordReset,
  signInWithEmailAndPassword
} from '@angular/fire/auth';
import { Router } from '@angular/router';

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

  // Iniciar sesión con email y contraseña
  async loginWithEmail(email: string, password: string): Promise<void> {
    try {
      const result = await signInWithEmailAndPassword(this.auth, email, password);
      console.log('Usuario autenticado con email:', result.user);
      this.router.navigate(['/home']);
    } catch (error) {
      console.error('Error al iniciar sesión con email:', error);
      throw error;
    }
  }

  // Obtener el usuario actual
  getCurrentUser() {
    return this.auth.currentUser;
  }

  // Cerrar sesión
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
        console.log('Cuenta eliminada exitosamente');
      } else {
        throw new Error('No hay un usuario autenticado');
      }
    } catch (error) {
      console.error('Error al eliminar la cuenta:', error);
      throw error;
    }
  }

  // Enviar email de recuperación
  sendPasswordResetEmail(email: string): Promise<void> {
    return sendPasswordResetEmail(this.auth, email);
  }

  // Confirmar nueva contraseña
  resetPasswordWithFirebase(oobCode: string, newPassword: string): Promise<void> {
    return confirmPasswordReset(this.auth, oobCode, newPassword);
  }
}