import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nav-motos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nav-motos.component.html',
  styleUrls: ['./nav-motos.component.css']
})
export class NavMotosComponent {
  @Output() seccionCambiada = new EventEmitter<string>();

  secciones = [
    { id: 'todas', nombre: 'Todas las motos' },
    { id: 'marcas', nombre: 'Por marca' },
    { id: 'precio', nombre: 'Por precio' },
    { id: 'cilindraje', nombre: 'Por cilindraje (>500cc)' }
  ];
  
  seccionActual = 'todas';

  cambiarSeccion(seccion: string) {
    this.seccionActual = seccion;
    this.seccionCambiada.emit(seccion);
  }
}