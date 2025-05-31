import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MotoService, Motocicleta } from '../../services/moto.service';
import { Observable, tap } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-motos-cilindraje',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './motos-cilindraje.component.html',
  styleUrl: './motos-cilindraje.component.css'
})
export class MotosCilindrajeComponent implements OnInit {
  private motoService = inject(MotoService);
  motos$!: Observable<Motocicleta[]>;

  ngOnInit() {
    this.motos$ = this.motoService.getMotosMayorA500cc().pipe(
      tap(motos => console.log('Motos recibidas:', motos))
    );
  }
}