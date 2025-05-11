import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MotoService, Motocicleta } from '../../services/moto.service';
import { Observable } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-todas-motos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './todas-motos.component.html',
  styleUrl: './todas-motos.component.css'
})
export class TodasMotosComponent {
  private motoService = inject(MotoService);
  motos$: Observable<Motocicleta[]> = this.motoService.getAllMotos();
}
