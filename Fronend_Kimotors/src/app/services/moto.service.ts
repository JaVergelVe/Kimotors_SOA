import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

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

@Injectable({
  providedIn: 'root'
})

export class MotoService {
  httpClient=inject(HttpClient)
  constructor() {
    this.httpClient.get<Motocicleta[]> ('http://localhost:8080/motocicletas/Aprilia').subscribe(moto=> {this.motos.push(moto)})
    this.httpClient.get<Motocicleta[]>('http://localhost:8080/motocicletas/Ducati').subscribe(moto=> {this.motos.push(moto)})
    this.httpClient.get<Motocicleta[]>('http://localhost:8080/motocicletas/Honda').subscribe(moto=> {this.motos.push(moto)})
    this.httpClient.get<Motocicleta[]>('http://localhost:8080/motocicletas/BMW').subscribe(moto=> {this.motos.push(moto)})
    this.httpClient.get<Motocicleta[]>('http://localhost:8080/motocicletas/CFMOTO').subscribe(moto=> {this.motos.push(moto)})
    this.httpClient.get<Motocicleta[]>('http://localhost:8080/motocicletas/Kawasaki').subscribe(moto=> {this.motos.push(moto)})
    this.httpClient.get<Motocicleta[]>('http://localhost:8080/motocicletas/KTM').subscribe(moto=> {this.motos.push(moto)})
    this.httpClient.get<Motocicleta[]>('http://localhost:8080/motocicletas/Yamaha').subscribe(moto=> {this.motos.push(moto)})
    console.log(this.motos)
  }
  motos:Motocicleta[][]= []


}
