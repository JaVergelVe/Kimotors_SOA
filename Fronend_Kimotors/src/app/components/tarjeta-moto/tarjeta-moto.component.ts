import { Component, inject } from '@angular/core';
import { MotoService } from '../../services/moto.service';
import { Motocicleta } from '../../services/moto.service';

@Component({
  selector: 'app-tarjeta-moto',
  imports: [],
  templateUrl: './tarjeta-moto.component.html',
  styleUrl: './tarjeta-moto.component.css'
})
export class TarjetaMotoComponent {
  motoService=inject(MotoService)
}
