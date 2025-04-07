import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AuthFirebaseService } from '../../services/authFireBase.service'
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reset-password-manual',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './reset-password-manual.component.html',
  styleUrl: './reset-password-manual.component.css'
})
export class ResetPasswordManualComponent {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);
  private authFirebaseService = inject(AuthFirebaseService);

  form: FormGroup = this.fb.group(
    {
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    },
    { validators: this.passwordMatchValidator }
  );

  oobCode: string | null = null;
  email: string | null = null;
  successMessage = '';
  errorMessage = '';

  constructor() {
    this.route.queryParams.subscribe(params => {
      this.oobCode = params['oobCode'] || null;
      this.email = params['email'] || null;
    });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    if (password !== confirmPassword) {
      control.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit(): void {
    const newPassword = this.form.value.password;

    console.log('OobCode:', this.oobCode);
    console.log('Nueva contraseña:', newPassword);

    if (this.oobCode) {
      // Firebase
      this.authFirebaseService.resetPasswordWithFirebase(this.oobCode, newPassword).subscribe({
        next: () => {
          this.successMessage = 'Contraseña restablecida con éxito (Firebase).';
          this.errorMessage = '';
          setTimeout(() => this.router.navigate(['/login']));
        },
        error: (err) => {
          this.successMessage = '';
          console.error('Error detallado al restablecer con Firebase:', err);
          this.errorMessage = 'Error al restablecer contraseña con Firebase.';
        }
      });
    } else if (this.email) {
      // MongoDB
      this.authService.updatePassword(this.email, newPassword).subscribe({
        next: () => {
          this.successMessage = 'Contraseña restablecida con éxito (MongoDB).';
          this.errorMessage = '';
          setTimeout(() => this.router.navigate(['/login']));
        },
        error: () => {
          this.successMessage = '';
          this.errorMessage = 'Error al restablecer contraseña con MongoDB.';
        }
      });
    } else {
      this.errorMessage = 'No se pudo determinar el origen del restablecimiento.';
    }
  }
}