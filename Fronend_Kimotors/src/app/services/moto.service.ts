import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';

export interface Motocicleta{
  marca: string;
  modelo: string;
  año: number;
  datos_motor: {
    cilindrada: number;
    disposicion: string;
    cilindros: string;
    distribucion: string;
    valvulas_por_cilindro: string;
    refrigeracion: string;
    compresion: string;
    potencia: string;
    torque: string;
  };
  transmision: {
    embrague: string;
    accionamiento: string;
  };
  suspension: {
    delantera: string;
    trasera: string;
  };
  frenos: {
    delantero: string;
    trasero: string;
  };
  ruedas: {
    delantera: string;
    trasera: string;
  };
  dimensiones: {
    capacidad_deposito: number;
    peso: number;
  };
  consumo: string;
  electronica: string;
  precio_aprox: string;
  imagenes: string[];
}

// Agregar esta interfaz para manejar colecciones
export interface MotosResponse {
  motocicletas: {
    [key: string]: Motocicleta[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class MotoService {
  private baseUrl = 'http://localhost:8080/motocicletas';
  private httpClient = inject(HttpClient);
  private motosSubject = new BehaviorSubject<MotosResponse['motocicletas']>({});
  motos$ = this.motosSubject.asObservable();

  constructor() {
    this.cargarTodasLasMotos();
  }

  private cargarTodasLasMotos() {
    this.httpClient.get<MotosResponse[]>(`${this.baseUrl}`)
      .pipe(
        map(response => response[0]?.motocicletas || {})
      )
      .subscribe({
        next: (motos) => {
          this.motosSubject.next(motos);
        },
        error: (error) => {
          console.error('Error al cargar las motos:', error);
        }
      });
  }

  getMotoPorMarca(marca: string): Observable<Motocicleta[]> {
    return this.httpClient.get<Motocicleta[]>(`${this.baseUrl}/${marca}`);
  }

  getTodasLasMarcas(): Observable<string[]> {
    return this.httpClient.get<string[]>(`${this.baseUrl}/marcas`);
  }

  // Método para obtener todas las motos en un array plano
  getAllMotos(): Observable<Motocicleta[]> {
    return this.motos$.pipe(
      map(motosObj => {
        return Object.values(motosObj).flat();
      })
    );
  }

  // Método para ordenar motos por precio
  getMotosByPrecio(): Observable<Motocicleta[]> {
    return this.getAllMotos().pipe(
      map(motos => {
        return motos.sort((a, b) => {
          const precioA = parseInt(a.precio_aprox.replace(/\D/g, ''));
          const precioB = parseInt(b.precio_aprox.replace(/\D/g, ''));
          return precioB - precioA;
        });
      })
    );
  }

  // Método para ordenar motos por cilindraje
  getMotosByCilindraje(): Observable<Motocicleta[]> {
    return this.getAllMotos().pipe(
      map(motos => {
        return motos.sort((a, b) => b.datos_motor.cilindrada - a.datos_motor.cilindrada);
      })
    );
  }

  // Propiedad para acceder al valor actual de las motos
  get motos(): MotosResponse['motocicletas'] {
    return this.motosSubject.value;
  }
}