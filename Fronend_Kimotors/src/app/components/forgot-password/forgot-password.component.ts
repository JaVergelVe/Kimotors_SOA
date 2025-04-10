import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthFirebaseService } from '../../services/authFireBase.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm!: FormGroup;
  submitted = false;
  message: string = '';
  errorMessage: string = '';
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private authFirebaseService: AuthFirebaseService
  ) {}

  ngOnInit() {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  get f() {
    return this.forgotPasswordForm.controls;
  }

  async onSubmit() {
    this.submitted = true;
    this.message = '';
    this.errorMessage = '';

    if (this.forgotPasswordForm.invalid) return;

    this.loading = true;
    const { email } = this.forgotPasswordForm.value;

    try {
      await this.authFirebaseService.sendPasswordResetEmail(email);
      this.message = 'Se ha enviado un enlace para restablecer tu contraseña.';
    } catch (error: any) {
      console.error('Error al enviar el email de restablecimiento:', error);

      switch (error.code) {
        case 'auth/user-not-found':
          this.errorMessage = 'No existe un usuario con ese correo.';
          break;
        case 'auth/invalid-email':
          this.errorMessage = 'El correo electrónico ingresado no es válido.';
          break;
        case 'auth/too-many-requests':
          this.errorMessage = 'Demasiados intentos. Intenta más tarde.';
          break;
        default:
          this.errorMessage = 'Ocurrió un error al enviar el correo. Intenta nuevamente.';
      }
    } finally {
      this.loading = false;
    }
  }
}