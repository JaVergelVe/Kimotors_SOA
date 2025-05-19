import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MotoService, Motocicleta } from '../../services/moto.service';
import { Observable, of, tap } from 'rxjs';
import { RouterLink } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-favoritos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './favoritos.component.html',
  styleUrl: './favoritos.component.css'
})
export class FavoritosComponent implements OnInit {
  private motoService = inject(MotoService);
  private authService = inject(AuthService);
  motosFavoritas$!: Observable<Motocicleta[]>;

  ngOnInit() {
    // Intentar obtener usuario de MongoDB primero
    const localUser = localStorage.getItem('currentUser');
    if (localUser) {
      const parsedUser: User = JSON.parse(localUser);
      if (parsedUser?.email) {
        console.log('Usuario de MongoDB encontrado:', parsedUser.email);
        this.motosFavoritas$ = this.motoService.getMotosFavoritas(parsedUser.email).pipe(
          tap(motos => {
            console.log('Motos favoritas recibidas:', motos);
            if (!motos || motos.length === 0) {
              console.log('No se encontraron motos favoritas');
            }
          })
        );
        return;
      }
    }

    console.log('No se encontró usuario de MongoDB');
    this.motosFavoritas$ = of([]);
  }

  eliminarDeFavoritos(modelo: string) {
    const localUser = localStorage.getItem('currentUser');
    if (!localUser) {
      console.error('No se encontró el usuario en localStorage');
      return;
    }

    const parsedUser: User = JSON.parse(localUser);
    if (!parsedUser?.email) {
      console.error('No se encontró el email del usuario');
      return;
    }

    // Codificar el modelo y el email para la URL
    const encodedEmail = encodeURIComponent(parsedUser.email);
    const encodedModelo = encodeURIComponent(modelo);

    this.motoService.eliminarDeFavoritos(encodedEmail, encodedModelo).subscribe({
      next: () => {
        // Actualizar la lista de favoritos
        this.motosFavoritas$ = this.motoService.getMotosFavoritas(parsedUser.email);
        alert('Moto eliminada de favoritos exitosamente');
      },
      error: (error) => {
        // Incluso con el error, verificamos si la operación fue exitosa
        if (error.status === 200) {
          this.motosFavoritas$ = this.motoService.getMotosFavoritas(parsedUser.email);
          alert('Moto eliminada de favoritos exitosamente');
        } else {
          console.error('Error al eliminar de favoritos:', error);
          alert('Error al eliminar la moto de favoritos');
        }
      }
    });
  }
}