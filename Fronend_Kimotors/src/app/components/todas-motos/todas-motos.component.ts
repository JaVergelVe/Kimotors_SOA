import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MotoService, Motocicleta } from '../../services/moto.service';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-todas-motos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './todas-motos.component.html',
  styleUrl: './todas-motos.component.css'
})
export class TodasMotosComponent implements OnInit {
  private motoService = inject(MotoService);
  private paginaActual = new BehaviorSubject<number>(0);
  private readonly elementosPorPagina = 5;
  motosAcumuladas: Motocicleta[] = [];
  motos$!: Observable<Motocicleta[]>;
  hayMasMotos = true;

  constructor() {
    console.log('Constructor de TodasMotosComponent');
  }

  ngOnInit() {
    console.log('ngOnInit de TodasMotosComponent');
    
    // Inicializamos el observable
    this.motos$ = this.paginaActual.pipe(
      switchMap(pagina => {
        console.log('Cargando página:', pagina);
        return this.motoService.getMotosPaginadas(
          pagina * this.elementosPorPagina, 
          this.elementosPorPagina
        );
      })
    );

    // Nos suscribimos para acumular las motos
    this.motos$.subscribe({
      next: (nuevasMotos) => {
        console.log('Motos recibidas:', nuevasMotos);
        
        // Verificamos si hay más motos para cargar
        if (nuevasMotos.length < this.elementosPorPagina) {
          this.hayMasMotos = false;
          console.log('No hay más motos para cargar');
        }
        
        this.motosAcumuladas = [...this.motosAcumuladas, ...nuevasMotos];
        console.log('Motos acumuladas:', this.motosAcumuladas);
      },
      error: (error) => {
        console.error('Error al cargar motos:', error);
        this.hayMasMotos = false;
      }
    });

    // Iniciamos la carga inicial
    console.log('Iniciando carga inicial');
    this.paginaActual.next(0);
  }

  cargarMas() {
    const siguientePagina = this.paginaActual.value + 1;
    console.log('Cargando más motos, página:', siguientePagina);
    this.paginaActual.next(siguientePagina);
  }
}