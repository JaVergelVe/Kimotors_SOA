import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
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

  constructor(private formBuilder: FormBuilder, private authFirebaseService: AuthFirebaseService, private router: Router) {}

  ngOnInit() {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    })
  }

  get f() {
    return this.forgotPasswordForm.controls;
  }

  async onSubmit() {
    this.submitted = true;
  
    if (this.forgotPasswordForm.invalid) return;
  
    const { email } = this.forgotPasswordForm.value;
  
    try {
      await this.authFirebaseService.sendPasswordResetEmail(email);
      this.message = 'Se ha enviado un enlace para restablecer tu contraseña.';
      this.errorMessage = '';
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        // Si el usuario no está en Firebase, redirigir a restablecer con Mongo
        this.router.navigate(['/reset-password-manual'], { queryParams: { email } });
      } else {
        this.message = '';
        this.errorMessage = 'Ocurrió un error al enviar el correo. Inténtalo de nuevo.';
        console.error(error);
      }
    }
  }
}