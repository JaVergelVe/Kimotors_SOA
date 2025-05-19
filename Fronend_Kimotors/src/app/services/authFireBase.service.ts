import { Injectable, NgZone } from '@angular/core';
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
  UserCredential,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  updateProfile
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class AuthFirebaseService {
  private sessionTimeout: any;
  private readonly SESSION_DURATION = 5 * 60 * 1000; // 5 minutos en milisegundos

  constructor(
    private auth: Auth,
    private router: Router,
    private toastr: ToastrService,
    private ngZone: NgZone
  ) { 
    this.initializeAuthListener();
  }

  private initializeAuthListener(): void {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.resetSessionTimer();
      } else {
        this.clearSessionTimer();
      }
    });
  }

  public resetTimer(): void {
    if (this.isAuthenticated) {
      this.resetSessionTimer();
    }
  }

  private resetSessionTimer(): void {
    this.clearSessionTimer();
    this.sessionTimeout = setTimeout(() => {
      this.ngZone.run(() => {
        this.logout();
        this.toastr.warning('La sesión ha expirado por inactividad');
        this.router.navigate(['/login']);
      });
    }, this.SESSION_DURATION);
  }

  private clearSessionTimer(): void {
    if (this.sessionTimeout) {
      clearTimeout(this.sessionTimeout);
    }
  }

  private async handleSuccessfulLogin(result: UserCredential, provider: string): Promise<void> {
    if (result.user) {
      const user = result.user;
      const email = user.email || user.providerData[0]?.email;
      const displayName = user.displayName || user.providerData[0]?.displayName || email?.split('@')[0];
      
      if (!email) {
        this.toastr.warning('No se pudo obtener el correo electrónico del usuario');
        return;
      }

      // Generamos una contraseña temporal segura
      const tempPassword = Math.random().toString(36).slice(-8) + 'Aa1!';

      try {
        // Intentamos crear el usuario con email/password y su displayName
        const userCredential = await createUserWithEmailAndPassword(this.auth, email, tempPassword);
        
        // Actualizamos el perfil del usuario con el nombre del proveedor social
        if (userCredential.user && displayName) {
          await updateProfile(userCredential.user, {
            displayName: displayName
          });
        }
      } catch (error: any) {
        // Si el error es que el usuario ya existe, simplemente continuamos
        if (error.code !== 'auth/email-already-in-use') {
          console.error('Error al configurar cuenta de email:', error);
        }
      }
    }

    this.toastr.success(`Inicio de sesión con ${provider} exitoso`);
    this.resetSessionTimer();
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
      provider.addScope('email');
      provider.addScope('profile');
      const result = await signInWithPopup(this.auth, provider);
      await this.handleSuccessfulLogin(result, 'Google');
    } catch (error: any) {
      if (error.message === 'login_cancelled') {
        this.toastr.info('Inicio de sesión cancelado');
        return;
      }
      console.error('Error al iniciar sesión con Google:', error);
      this.toastr.error('Error al iniciar sesión con Google');
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
      console.error('Error al iniciar sesión con Facebook:', error);
      this.toastr.error('Error al iniciar sesión con Facebook');
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
      console.error('Error al iniciar sesión con GitHub:', error);
      this.toastr.error('Error al iniciar sesión con GitHub');
    }
  }

  async createUserWithEmail(email: string, password: string): Promise<void> {
    await createUserWithEmailAndPassword(this.auth, email, password);
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
  getCurrentUserInfo() {
    const user = this.auth.currentUser;
    if (user) {
      // Obtenemos el email del usuario actual o del primer proveedor si está disponible
      const email = user.email || user.providerData[0]?.email || null;
      
      return {
        uid: user.uid,
        email: email,
        displayName: user.displayName || user.providerData[0]?.displayName || null,
        photoURL: user.photoURL || user.providerData[0]?.photoURL || null,
        providerData: user.providerData.map(provider => ({
          providerId: provider.providerId,
          email: provider.email,
          displayName: provider.displayName,
          photoURL: provider.photoURL
        }))
      };
    }
    return null;
  }

  get isAuthenticated(): boolean {
    return this.auth.currentUser !== null;
  }

  // Cerrar sesión
  async logout(): Promise<void> {
    try {
      this.clearSessionTimer();
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
    try {
      if (!email) {
        this.toastr.error('No se encontró una dirección de correo electrónico válida');
        throw new Error('No email address available');
      }

      // Simplificamos el proceso y solo enviamos el correo
      await sendPasswordResetEmail(this.auth, email);
      
      this.toastr.success('Se ha enviado un correo para restablecer la contraseña');
      this.toastr.info('Por favor, revisa tu bandeja de entrada y sigue las instrucciones');
      
      // Si el usuario está autenticado, cerramos la sesión
      if (this.auth.currentUser) {
        await this.logout();
        await this.router.navigate(['/login']);
      }

    } catch (error: any) {
      console.error('Error en el proceso de restablecimiento:', error);
      
      if (error.code === 'auth/user-not-found') {
        this.toastr.error('No existe una cuenta con este correo electrónico');
      } else if (error.code === 'auth/invalid-email') {
        this.toastr.error('El formato del correo electrónico no es válido');
      } else if (error.code === 'auth/requires-recent-login') {
        this.toastr.error('Por seguridad, necesitas volver a iniciar sesión');
        await this.logout();
        this.router.navigate(['/login']);
      } else {
        this.toastr.error('Error al enviar el email de recuperación');
      }
      throw error;
    }
  }

  // Confirmar nueva contraseña
  resetPasswordWithFirebase(oobCode: string, newPassword: string): Promise<void> {
    return confirmPasswordReset(this.auth, oobCode, newPassword);
  }
}