import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

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

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]], 
      confirmNewPassword: ['', [Validators.required, Validators.minLength(6)]],
    }, {
      validators: this.passwordMatchValidator
    }
  ); 
  }

  // Función para validar que las contraseñas coincidan
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      control.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      return null;
    }
  }

  get f() {
    return this.forgotPasswordForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    if (this.forgotPasswordForm.invalid) {
      return;
    }

    console.log('Formulario válido:', this.forgotPasswordForm.value);
    this.message = 'Contraseña restablecida correctamente';
  }
}