import { inject, Injectable } from '@angular/core';
import { Motocicleta, MotoService } from './moto.service';

@Injectable({
  providedIn: 'root'
})

export class ComparacionService {
  motoService=inject(MotoService)
  array: Motocicleta[]=[];

  constructor(){
    (this.motoService.getAllMotos().subscribe(motos=>{
      this.setArray(motos)
    }))
  }

  setArray(array:Motocicleta[]){
    this.array=array
  }

  findMotos(nombre: string ){
    const motoNombre=nombre.toLowerCase()
    return(this.array.filter( moto=> moto.marca.toLowerCase().includes(motoNombre)|| moto.modelo.toLowerCase().includes(motoNombre)))

  }
}
