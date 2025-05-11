import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TarjetaMotoComponent } from '../tarjeta-moto/tarjeta-moto.component';
import { FormsModule } from '@angular/forms';
import { NavMotosComponent } from "../nav-motos/nav-motos.component";
import { TodasMotosComponent } from '../todas-motos/todas-motos.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-main-page',
  imports: [CommonModule, TarjetaMotoComponent, TodasMotosComponent, FormsModule, NavMotosComponent, RouterModule],
  standalone: true,
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css'
})
export class MainPageComponent {
  seccionActual = 'todas';

  cambiarSeccion(seccion: string) {
    this.seccionActual = seccion;
  }
}
