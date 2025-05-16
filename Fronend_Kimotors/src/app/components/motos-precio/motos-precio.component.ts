import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Motocicleta, MotoService } from '../../services/moto.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-motos-precio',
  imports: [CommonModule, RouterLink],
  templateUrl: './motos-precio.component.html',
  styleUrl: './motos-precio.component.css'
})
export class MotosPrecioComponent {
  private motoService = inject(MotoService);
  motos$: Observable<Motocicleta[]>;

  constructor() {
    this.motos$ = this.motoService.getMotosPorPrecioDescendente();
  }
}
