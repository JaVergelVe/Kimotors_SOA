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
      // Intentar primero con MongoDB
      this.authService.getUserByEmail(email).subscribe({
        next: (user) => {
          if (user && user.password === password) {
            // Si la autenticación con MongoDB es exitosa
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.router.navigate(['/home']);
            return;
          }
          
          // Si MongoDB falla, intentar con Firebase
          this.authFirebaseService.loginWithEmail(email, password)
            .then(() => {
              // Éxito con Firebase
              this.router.navigate(['/home']);
            })
            .catch((error) => {
              console.error('Error en autenticación con Firebase:', error);
              alert('Credenciales incorrectas');
            });
        },
        error: (error) => {
          console.error('Error al verificar en MongoDB:', error);
          // Si hay error con MongoDB, intentar con Firebase
          this.authFirebaseService.loginWithEmail(email, password)
            .then(() => {
              this.router.navigate(['/home']);
            })
            .catch((firebaseError) => {
              console.error('Error en autenticación con Firebase:', firebaseError);
              alert('Error en la autenticación');
            });
        }
      });
    } catch (error) {
      console.error('Error general en el inicio de sesión:', error);
      alert('Error en el inicio de sesión');
    }
  }
}