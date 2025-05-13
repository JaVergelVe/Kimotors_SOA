import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { AuthFirebaseService } from '../../services/authFireBase.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  submitted = false;

  private authService = inject(AuthService);
  private authFirebaseService = inject(AuthFirebaseService);
  private router = inject(Router);

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  // Iniciar sesión con Google
  async loginWithGoogle() {
    await this.authFirebaseService.loginWithGoogle();
  }

  // Iniciar sesión con GitHub
  async loginWithGithub() {
    await this.authFirebaseService.loginWithGithub();
  }

  // Iniciar sesión con Facebook
  async loginWithFacebook() {
    await this.authFirebaseService.loginWithFacebook();
  }

  get f() {
    return this.loginForm.controls;
  }

  // Iniciar sesión con email y contraseña (MongoDB)
  async onSubmit() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    const { email, password } = this.loginForm.value;

    try {
      // Primero intentamos autenticar con Firebase
      await this.authFirebaseService.loginWithEmail(email, password);
      
      // Si la autenticación con Firebase es exitosa, procedemos con MongoDB
      const user = await this.authService.getUserByEmail(email).toPromise();

      if (!user) {
        alert('Usuario no encontrado en MongoDB');
        return;
      }

      if (user.password !== password) {
        alert('Contraseña incorrecta');
        return;
      }

      localStorage.setItem('currentUser', JSON.stringify(user));
      this.router.navigate(['/home']);

    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      // No mostramos alert aquí ya que authFirebaseService ya maneja los mensajes de error
    }
  }
}