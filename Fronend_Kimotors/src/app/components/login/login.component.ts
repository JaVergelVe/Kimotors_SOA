import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

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
    await this.authService.loginWithGoogle();
  }

  get f() {
    return this.loginForm.controls;
  }

  // 🔹 Iniciar sesión con email y contraseña
  async onSubmit() {
    this.submitted = true;
  
    if (this.loginForm.invalid) {
      return;
    }
  
    const { email, password } = this.loginForm.value;
  
    try {
      const user = await this.authService.getUserByEmail(email).toPromise();
  
      // ✅ Verificar si el usuario es undefined
      if (!user) {
        alert('Usuario no encontrado');
        return;
      }
  
      // 🔍 Verificar si la contraseña es correcta
      if (user.password !== password) {
        alert('Contraseña incorrecta');
        return;
      }
  
      // ✅ Guardar el usuario en el LocalStorage (persistir sesión)
      localStorage.setItem('currentUser', JSON.stringify(user));
  
      this.router.navigate(['/home']); // Redirige a la página principal
  
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      alert('Error al iniciar sesión');
    }
  }
}