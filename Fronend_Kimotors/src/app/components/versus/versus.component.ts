import { Component, inject } from '@angular/core';
import { ComparacionService } from '../../services/comparacion.service';
import { FormsModule } from '@angular/forms';
import { Motocicleta, MotoService } from '../../services/moto.service';

@Component({
  selector: 'app-versus',
  imports :[FormsModule],
  templateUrl: './versus.component.html',
  styleUrl: './versus.component.css'
})
export class VersusComponent {
  motoService=inject(ComparacionService)
  arreglo: Motocicleta []=[]

  findMotos(event:Event){

    const valor = (event.target as HTMLInputElement).value

    this.arreglo=this.motoService.findMotos(valor)
    console.log(this.arreglo)
  }

}
