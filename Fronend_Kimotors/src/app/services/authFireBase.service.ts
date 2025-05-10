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
  signInWithEmailAndPassword,
  linkWithCredential,
  UserCredential,
  AuthCredential,
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class AuthFirebaseService {
  private pendingCred: AuthCredential | null = null;
  private pendingToLink: string | null = null;

  constructor(
    private auth: Auth,
    private router: Router,
    private toastr: ToastrService
  ) {}

  // LOGIN CON GOOGLE
  async loginWithGoogle(): Promise<void> {
    const provider = new GoogleAuthProvider();
    try {
      const result: UserCredential = await signInWithPopup(this.auth, provider);
      this.toastr.success(' Inicio de sesión con Google exitoso');
      
      // Si hay credenciales pendientes por vincular
      if (this.pendingCred) {
        await linkWithCredential(result.user, this.pendingCred);
        this.toastr.success(`${this.pendingToLink} vinculado correctamente`);
        this.pendingCred = null;
        this.pendingToLink = null;
      }

      // Solo redirige si el inicio de sesión fue exitoso
      this.router.navigate(['/home']);
    } catch (error: any) {
      console.error('Error al autenticar con Google:', error);
      if (error.code === 'auth/account-exists-with-different-credential') {
        const cred = GoogleAuthProvider.credentialFromError(error);
        const email = error.customData?.email;
        if (cred && email) {
          this.pendingCred = cred;
          this.pendingToLink = 'google.com';
          this.toastr.warning(
            `La cuenta con ${email} ya existe con otro proveedor. Por favor, inicia sesión con Facebook o GitHub.`
          );
        }
      } else {
        this.toastr.error('Error al iniciar sesión con Google');
      }
    }
  }

  // LOGIN CON FACEBOOK
  async loginWithFacebook(): Promise<void> {
    const provider = new FacebookAuthProvider();
    provider.addScope('email');
    try {
      const result: UserCredential = await signInWithPopup(this.auth, provider);
      this.toastr.success(' Inicio de sesión con Facebook exitoso');

      if (this.pendingCred) {
        await linkWithCredential(result.user, this.pendingCred);
        this.toastr.success(`${this.pendingToLink} vinculado correctamente`);
        this.pendingCred = null;
        this.pendingToLink = null;
      }

      this.router.navigate(['/home']);
    } catch (error: any) {
      console.error('Error al autenticar con Facebook:', error);
      if (error.code === 'auth/account-exists-with-different-credential') {
        const cred = FacebookAuthProvider.credentialFromError(error);
        const email = error.customData?.email;
        if (cred && email) {
          this.pendingCred = cred;
          this.pendingToLink = 'facebook.com';
          this.toastr.warning(
            `La cuenta con ${email} ya existe con otro proveedor. Por favor, inicia sesión con Google o GitHub.`,
            '⚠️ Cuenta existente'
          );
        }
      } else {
        this.toastr.error('Error al iniciar sesión con Facebook');
      }
    }
  }

  // LOGIN CON GITHUB
  async loginWithGithub(): Promise<void> {
    const provider = new GithubAuthProvider();
    try {
      const result: UserCredential = await signInWithPopup(this.auth, provider);
      this.toastr.success('Inicio de sesión con GitHub exitoso');

      if (this.pendingCred) {
        await linkWithCredential(result.user, this.pendingCred);
        this.toastr.success(`${this.pendingToLink} vinculado correctamente`);
        this.pendingCred = null;
        this.pendingToLink = null;
      }

      this.router.navigate(['/home']);
    } catch (error: any) {
      console.error('Error al autenticar con GitHub:', error);
      if (error.code === 'auth/account-exists-with-different-credential') {
        const cred = GithubAuthProvider.credentialFromError(error);
        const email = error.customData?.email;
        if (cred && email) {
          this.pendingCred = cred;
          this.pendingToLink = 'github.com';
          this.toastr.warning(
            `La cuenta con ${email} ya existe con otro proveedor. Por favor, inicia sesión con Google o Facebook.`
          );
        }
      } else {
        this.toastr.error('Error al iniciar sesión con GitHub');
      }
    }
  }

  // Iniciar sesión con email y contraseña
  async loginWithEmail(email: string, password: string): Promise<void> {
    try {
      const result = await signInWithEmailAndPassword(this.auth, email, password);
      this.toastr.success('Inicio de sesión exitoso', '✔️ Bienvenido');
      this.router.navigate(['/home']);
    } catch (error) {
      console.error('Error al iniciar sesión con email:', error);
      this.toastr.error('Error al iniciar sesión con email', '❌ Fallo');
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
      this.toastr.success('Sesión cerrada exitosamente', '✔️ Hasta pronto');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      this.toastr.error('Error al cerrar sesión', '❌ Fallo');
    }
  }

  // Eliminar cuenta de Firebase
  async deleteFirebaseUser(): Promise<void> {
    try {
      const currentUser = this.auth.currentUser;
      if (currentUser) {
        await deleteUser(currentUser);
        this.toastr.success('Cuenta eliminada exitosamente', '✅ Adiós');
        this.router.navigate(['/']);
      } else {
        throw new Error('No hay un usuario autenticado');
      }
    } catch (error) {
      console.error('Error al eliminar la cuenta:', error);
      this.toastr.error('No se pudo eliminar la cuenta', '❌ Error');
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