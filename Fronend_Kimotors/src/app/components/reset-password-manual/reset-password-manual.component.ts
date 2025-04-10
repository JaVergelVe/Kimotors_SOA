import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthFirebaseService } from '../../services/authFireBase.service';
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
  private authFirebaseService = inject(AuthFirebaseService);

  form: FormGroup = this.fb.group(
    {
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    },
    { validators: this.passwordMatchValidator }
  );

  oobCode: string | null = null;
  successMessage = '';
  errorMessage = '';

  constructor() {
    this.route.queryParams.subscribe(params => {
      this.oobCode = params['oobCode'] || null;
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

    if (this.oobCode) {
      this.authFirebaseService.resetPasswordWithFirebase(this.oobCode, newPassword)
        .then(() => {
          this.successMessage = 'Contraseña restablecida con éxito.';
          this.errorMessage = '';
          setTimeout(() => this.router.navigate(['/login']), 2500);
        })
        .catch((err: any) => {
          console.error('Error al restablecer con Firebase:', err);
          this.successMessage = '';
          this.errorMessage = 'Error al restablecer contraseña.';
        });
    } else {
      this.errorMessage = 'Código de verificación no válido.';
    }
  }
}