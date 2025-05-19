import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DatosMotorResponse, MotoService, Motocicleta } from '../../services/moto.service';

@Component({
  selector: 'app-vista-moto',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vista-moto.component.html',
  styleUrl: './vista-moto.component.css'
})
export class VistaMotoComponent implements OnInit {
  moto?: Motocicleta;
  imagenActual: string = '';
  indiceImagen: number = 0;
  datosMotor?: DatosMotorResponse;
  mostrarDatosMotor: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private motoService: MotoService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const marca = params['marca'];
      const modelo = params['modelo'];
      this.cargarDetallesMoto(marca, modelo);
    });
  }

  cargarDetallesMoto(marca: string, modelo: string) {
    this.motoService.getAllMotos().subscribe(motos => {
      this.moto = motos.find(m => m.marca === marca && m.modelo === modelo);
      if (this.moto && this.moto.imagenes.length > 0) {
        this.imagenActual = this.moto.imagenes[0];
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

  agregarAFavoritos() {
    const localUser = localStorage.getItem('currentUser');
    if (!localUser) {
      alert('Debes iniciar sesión para agregar a favoritos');
      return;
    }

    const parsedUser = JSON.parse(localUser);
    if (!parsedUser?.email || !this.moto?.modelo) {
      console.error('Falta información necesaria');
      return;
    }

    const encodedEmail = encodeURIComponent(parsedUser.email);
    const encodedModelo = encodeURIComponent(this.moto.modelo);

    this.motoService.agregarAFavoritos(encodedEmail, encodedModelo).subscribe({
      next: () => {
        alert('Moto agregada a favoritos exitosamente');
      },
      error: (error) => {
        if (error.status === 200) {
          alert('Moto agregada a favoritos exitosamente');
        } else {
          console.error('Error al agregar a favoritos:', error);
          alert('Error al agregar la moto a favoritos');
        }
      }
    });
  }
}