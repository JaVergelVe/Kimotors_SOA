import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DatosMotorResponse, MotoService, Motocicleta } from '../../services/moto.service';
import { Comentario, ComentarioService } from '../../services/comentarios.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-vista-moto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vista-moto.component.html',
  styleUrl: './vista-moto.component.css'
})
export class VistaMotoComponent implements OnInit {
  moto?: Motocicleta;
  imagenActual: string = '';
  indiceImagen: number = 0;
  datosMotor?: DatosMotorResponse;
  mostrarDatosMotor: boolean = false;
  estaEnFavoritos: boolean = false;
  comentarios: Comentario[] = [];
  nuevoComentario: string = '';

  constructor(
    private route: ActivatedRoute,
    private motoService: MotoService,
    private comentarioService: ComentarioService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const marca = params['marca'];
      const modelo = params['modelo'];
      this.cargarDetallesMoto(marca, modelo);
      this.verificarSiEstaEnFavoritos(modelo);
    });
  }

  cargarDetallesMoto(marca: string, modelo: string) {
    this.motoService.getAllMotos().subscribe(motos => {
      this.moto = motos.find(m => m.marca === marca && m.modelo === modelo);
      if (this.moto) {
        if (this.moto.imagenes.length > 0) {
          this.imagenActual = this.moto.imagenes[0];
        }
        this.cargarComentarios(marca, modelo);
      } else {
        console.warn('Moto no encontrada con marca y modelo:', marca, modelo);
      }
    });
  }

  cargarComentarios(marca: string, modelo: string) {
    this.comentarioService.obtenerComentariosPorMoto(marca, modelo).subscribe({
      next: (comentarios) => this.comentarios = comentarios,
      error: (error) => console.error('Error al cargar comentarios:', error)
    });
  }
  
  enviarComentario() {
    const localUser = localStorage.getItem('currentUser');
    if (!localUser) {
      alert('Debes iniciar sesión para comentar');
      return;
    }
  
    const usuario = JSON.parse(localUser);
    if (!usuario.email || !this.nuevoComentario.trim() || !this.moto) return;
  
    const comentario: Comentario = {
      texto: this.nuevoComentario.trim(),
      userEmail: usuario.email,
      motoMarca: this.moto.marca,
      motoModelo: this.moto.modelo,
      fecha: new Date().toISOString() // Opcional, si no lo genera el backend
    };
    
    this.comentarioService.agregarComentario(comentario).subscribe({
      next: (nuevoComentario) => {
        this.comentarios.push(nuevoComentario); // Esto está bien
        this.nuevoComentario = '';
      },
      error: (error) => {
        console.error('Error al agregar comentario:', error);
      }
    });
  }

  cambiarImagen(indice: number) {
    if (this.moto && this.moto.imagenes[indice]) {
      this.imagenActual = this.moto.imagenes[indice];
      this.indiceImagen = indice;
    }
  }

  toggleDatosMotor() {
    if (!this.datosMotor && this.moto) {
      this.motoService.getDatosMotor(this.moto.modelo).subscribe(datos => {
        if (datos && datos.length > 0) {
          this.datosMotor = datos[0];
        }
      });
    }
    this.mostrarDatosMotor = !this.mostrarDatosMotor;
  }

  verificarSiEstaEnFavoritos(modelo: string) {
    const localUser = localStorage.getItem('currentUser');
    if (localUser) {
      const parsedUser = JSON.parse(localUser);
      if (parsedUser?.email) {
        this.motoService.getMotosFavoritas(parsedUser.email).subscribe({
          next: (motos) => {
            this.estaEnFavoritos = motos.some(moto => moto.modelo === modelo);
          },
          error: (error) => {
            console.error('Error al verificar favoritos:', error);
          }
        });
      }
    }
  }

  toggleFavoritos() {
    const localUser = localStorage.getItem('currentUser');
    if (!localUser) {
      alert('Debes iniciar sesión para gestionar favoritos');
      return;
    }

    const parsedUser = JSON.parse(localUser);
    if (!parsedUser?.email || !this.moto?.modelo) {
      console.error('Falta información necesaria');
      return;
    }

    const encodedEmail = encodeURIComponent(parsedUser.email);
    const encodedModelo = encodeURIComponent(this.moto.modelo);

    if (this.estaEnFavoritos) {
      this.motoService.eliminarDeFavoritos(encodedEmail, encodedModelo).subscribe({
        next: () => {
          this.estaEnFavoritos = false;
          alert('Moto eliminada de favoritos exitosamente');
        },
        error: (error) => {
          if (error.status === 200) {
            this.estaEnFavoritos = false;
            alert('Moto eliminada de favoritos exitosamente');
          } else {
            console.error('Error al eliminar de favoritos:', error);
            alert('Error al eliminar la moto de favoritos');
          }
        }
      });
    } else {
      this.motoService.agregarAFavoritos(encodedEmail, encodedModelo).subscribe({
        next: () => {
          this.estaEnFavoritos = true;
          alert('Moto agregada a favoritos exitosamente');
        },
        error: (error) => {
          if (error.status === 200) {
            this.estaEnFavoritos = true;
            alert('Moto agregada a favoritos exitosamente');
          } else {
            console.error('Error al agregar a favoritos:', error);
            alert('Error al agregar la moto a favoritos');
          }
        }
      });
    }
  }
}