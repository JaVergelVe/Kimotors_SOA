import { Component, inject } from '@angular/core';
import { MotoService, Motocicleta } from '../../services/moto.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

type MotosMap = {
  [key: string]: Motocicleta[];
};

@Component({
  selector: 'app-tarjeta-moto',
  standalone: true,
  imports: [AsyncPipe, RouterLink, CommonModule],
  templateUrl: './tarjeta-moto.component.html',
  styleUrl: './tarjeta-moto.component.css'
})
export class TarjetaMotoComponent {
  motoService = inject(MotoService);
  motos$ = this.motoService.motos$;

  getKeys(obj: MotosMap): string[] {
    return obj ? Object.keys(obj) : [];
  }

  getMotosPorMarca(motos: MotosMap, marca: string): Motocicleta[] {
    return motos[marca] || [];
  }

  ngOnInit() {
    this.motos$.subscribe(motos => {
      console.log('Motos en el componente:', motos);
    });
  }
}