import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';
import { AuthFirebaseService } from '../../services/authFireBase.service';
import { User as FirebaseUser } from '@angular/fire/auth';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
})
export class UserProfileComponent implements OnInit {
  user: User | FirebaseUser | null = null;
  username: string | null = null;
  isMongoUser = false;

  showChangePassword = false;
  changePasswordForm: FormGroup;

  successMessage = '';
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private authFirebaseService: AuthFirebaseService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.changePasswordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    }, { validators: this.passwordsMatchValidator });
  }

  ngOnInit(): void {
    this.getUserInfo();
  }

  getUserInfo(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser && 'displayName' in currentUser) {
      this.user = currentUser;
      this.username = currentUser.displayName || 'Usuario de Google';
      this.isMongoUser = false;
      return;
    }

    const localUser = localStorage.getItem('currentUser');
    if (localUser) {
      const parsedUser: User = JSON.parse(localUser);
      this.user = parsedUser;
      this.username = parsedUser.username;
      this.isMongoUser = true;
      return;
    }

    console.warn('No hay un usuario autenticado.');
    this.router.navigate(['/login']);
  }

  async logout(): Promise<void> {
    await this.authFirebaseService.logout();
    localStorage.removeItem('currentUser');
    this.router.navigate(['/']);
  }

  async deleteUser(): Promise<void> {
    if (!this.user || !this.user.email) return;

    const email = this.user.email;
    const isFirebaseUser = 'providerData' in this.user && this.user.providerData.length > 0;

    if (isFirebaseUser) {
      try {
        await this.authFirebaseService.deleteFirebaseUser();
        localStorage.removeItem('currentUser');
        this.router.navigate(['/']);
      } catch (error) {
        console.error('Error al eliminar usuario de Firebase:', error);
      }
    } else {
      this.authService.deleteUser(email).subscribe({
        next: () => {
          localStorage.removeItem('currentUser');
          this.router.navigate(['/']);
        },
        error: (err) => console.error('Error al eliminar usuario MongoDB:', err),
      });
    }
  }

  toggleChangePassword(): void {
    this.showChangePassword = !this.showChangePassword;
    this.successMessage = '';
    this.errorMessage = '';
    this.changePasswordForm.reset();
  }

  passwordsMatchValidator(group: FormGroup) {
    const newPass = group.get('newPassword')?.value;
    const confirmPass = group.get('confirmPassword')?.value;
    return newPass === confirmPass ? null : { passwordMismatch: true };
  }

  onChangePassword(): void {
    if (!this.user || !('email' in this.user) || !this.user.email) {
      this.errorMessage = 'Error: Usuario no válido o sin correo electrónico.';
      return;
    }
  
    const email = this.user.email;
    const { currentPassword, newPassword } = this.changePasswordForm.value;
  
    this.authService.login(email, currentPassword).subscribe({
      next: () => {
        this.authService.updatePassword(email, newPassword).subscribe({
          next: () => {
            this.successMessage = 'Contraseña actualizada exitosamente.';
            this.errorMessage = '';
            this.changePasswordForm.reset();
          },
          error: () => {
            this.errorMessage = 'Error al actualizar la contraseña.';
            this.successMessage = '';
          }
        });
      },
      error: () => {
        this.errorMessage = 'La contraseña actual es incorrecta.';
        this.successMessage = '';
      }
    });
  }

  navigateToHome() {
    this.router.navigate(['/']);
  }
}