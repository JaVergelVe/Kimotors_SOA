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
  ) { }

  private async handleAuthError(error: any, provider: string): Promise<void> {
    console.error(`Error al autenticar con ${provider}:`, error);

    if (error.code === 'auth/account-exists-with-different-credential') {
      const email = error.customData?.email;
      let cred;

      switch (provider) {
        case 'Google':
          cred = GoogleAuthProvider.credentialFromError(error);
          break;
        case 'Facebook':
          cred = FacebookAuthProvider.credentialFromError(error);
          break;
        case 'GitHub':
          cred = GithubAuthProvider.credentialFromError(error);
          break;
      }

      if (cred && email) {
        this.pendingCred = cred;
        this.pendingToLink = `${provider.toLowerCase()}.com`;
        const otherProviders = ['Google', 'Facebook', 'GitHub']
          .filter(p => p !== provider)
          .join(' o ');

        this.toastr.warning(
          `La cuenta con ${email} ya existe con otro proveedor. Por favor, inicia sesión con ${otherProviders}.`
        );
      }
    } else {
      this.toastr.error(`Error al iniciar sesión con ${provider}`);
      throw error;
    }
  }

  private async handleSuccessfulLogin(result: UserCredential, provider: string): Promise<void> {
    this.toastr.success(`Inicio de sesión con ${provider} exitoso`);

    if (this.pendingCred) {
      await linkWithCredential(result.user, this.pendingCred);
      this.toastr.success(`${this.pendingToLink} vinculado correctamente`);
      this.pendingCred = null;
      this.pendingToLink = null;
    }

    await this.router.navigate(['/home']);
  }

  private async checkAndHandleExistingSession(): Promise<void> {
    if (this.isAuthenticated) {
      const confirmLogout = window.confirm('Ya hay una sesión activa. ¿Desea cerrar la sesión actual e iniciar una nueva?');
      if (confirmLogout) {
        await this.logout();
      } else {
        throw new Error('login_cancelled');
      }
    }
  }

  // LOGIN CON GOOGLE
  async loginWithGoogle(): Promise<void> {
    try {
      await this.checkAndHandleExistingSession();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(this.auth, provider);
      await this.handleSuccessfulLogin(result, 'Google');
    } catch (error: any) {
      if (error.message === 'login_cancelled') {
        this.toastr.info('Inicio de sesión cancelado');
        return;
      }
      await this.handleAuthError(error, 'Google');
    }
  }

  // LOGIN CON FACEBOOK
  async loginWithFacebook(): Promise<void> {
    try {
      await this.checkAndHandleExistingSession();
      const provider = new FacebookAuthProvider();
      provider.addScope('email');
      const result = await signInWithPopup(this.auth, provider);
      await this.handleSuccessfulLogin(result, 'Facebook');
    } catch (error: any) {
      if (error.message === 'login_cancelled') {
        this.toastr.info('Inicio de sesión cancelado');
        return;
      }
      await this.handleAuthError(error, 'Facebook');
    }
  }

  // LOGIN CON GITHUB
  async loginWithGithub(): Promise<void> {
    try {
      await this.checkAndHandleExistingSession();
      const provider = new GithubAuthProvider();
      const result = await signInWithPopup(this.auth, provider);
      await this.handleSuccessfulLogin(result, 'GitHub');
    } catch (error: any) {
      if (error.message === 'login_cancelled') {
        this.toastr.info('Inicio de sesión cancelado');
        return;
      }
      await this.handleAuthError(error, 'GitHub');
    }
  }

  // Iniciar sesión con email y contraseña
  async loginWithEmail(email: string, password: string): Promise<void> {
    try {
      await this.checkAndHandleExistingSession();
      const result = await signInWithEmailAndPassword(this.auth, email, password);

      // Verificar si el usuario existe en Firebase
      if (result.user) {
        this.toastr.success('Inicio de sesión exitoso');
        await this.router.navigate(['/home']);
      } else {
        this.toastr.error('Usuario no encontrado');
        await this.logout();
        return;
      }

    } catch (error: any) {
      if (error.message === 'login_cancelled') {
        this.toastr.info('Inicio de sesión cancelado');
        return;
      }

      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        this.toastr.error('Credenciales incorrectas');
      } else {
        console.error('Error al iniciar sesión con email:', error);
        this.toastr.error('Error al iniciar sesión con email');
      }
      throw error;
    }
  }

  // Obtener el usuario actual
  getCurrentUser() {
    return this.auth.currentUser;
  }

  get isAuthenticated(): boolean {
    return this.auth.currentUser !== null;
  }

  getCurrentProvider(): string | null {
    const user = this.auth.currentUser;
    if (!user || !user.providerData.length) return null;
    return user.providerData[0].providerId;
  }

  // Cerrar sesión
  async logout(): Promise<void> {
    try {
      await this.auth.signOut();
      this.toastr.success('Sesión cerrada exitosamente');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      this.toastr.error('Error al cerrar sesión');
    }
  }

  // Eliminar cuenta de Firebase
  async deleteFirebaseUser(): Promise<void> {
    try {
      const currentUser = this.auth.currentUser;
      if (currentUser) {
        await deleteUser(currentUser);
        this.toastr.success('Cuenta eliminada exitosamente');
        this.router.navigate(['/']);
      } else {
        throw new Error('No hay un usuario autenticado');
      }
    } catch (error) {
      console.error('Error al eliminar la cuenta:', error);
      this.toastr.error('No se pudo eliminar la cuenta');
      throw error;
    }
  }

  // Enviar email de recuperación
  async sendPasswordResetEmail(email: string): Promise<void> {
    const confirmar = window.confirm(
      `ADVERTENCIA: Si esta cuenta está vinculada con proveedores sociales (Google, Facebook, GitHub):\n\n` +
      `Al restablecer la contraseña, las vinculaciones con estos proveedores se perderán por razones de seguridad.\n` +
      `Después de restablecer la contraseña, necesitarás volver a vincular estos proveedores desde tu perfil.\n\n` +
      `¿Deseas continuar con el restablecimiento de contraseña?`
    );
    
    if (!confirmar) {
      this.toastr.info('Restablecimiento de contraseña cancelado');
      return;
    }
    
    try {
      // Solo procedemos con el envío si el usuario confirmó
      await sendPasswordResetEmail(this.auth, email);
      this.toastr.success('Se ha enviado un correo para restablecer la contraseña');
    } catch (error) {
      console.error('Error al enviar el email de recuperación:', error);
      this.toastr.error('Error al enviar el email de recuperación');
      throw error;
    }
  }

  // Confirmar nueva contraseña
  resetPasswordWithFirebase(oobCode: string, newPassword: string): Promise<void> {
    return confirmPasswordReset(this.auth, oobCode, newPassword);
  }
}