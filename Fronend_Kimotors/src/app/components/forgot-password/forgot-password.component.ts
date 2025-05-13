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

    if (this.forgotPasswordForm.invalid) {
      this.errorMessage = 'Por favor, verifica los datos ingresados.';
      return;
    }

    this.loading = true;
    const { email } = this.forgotPasswordForm.value;

    try {
      await this.authFirebaseService.sendPasswordResetEmail(email);
      // No necesitamos establecer un mensaje aquí ya que el servicio maneja las notificaciones
      this.forgotPasswordForm.reset();
      this.submitted = false;
    } catch (error: any) {
      // Solo manejamos errores específicos de validación del formulario
      if (error.code === 'auth/invalid-email') {
        this.errorMessage = 'El formato del correo electrónico no es válido.';
      }
      // Los demás errores ya son manejados por el servicio
    } finally {
      this.loading = false;
    }
  }
}