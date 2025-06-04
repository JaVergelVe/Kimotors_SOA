import { Component, inject } from '@angular/core';
import { ComparacionService } from '../../services/comparacion.service';
import { FormsModule } from '@angular/forms';
import { Motocicleta, MotoService } from '../../services/moto.service';
import { MoticoVSComponent } from "../motico-vs/motico-vs.component";

@Component({
  selector: 'app-versus',
  imports: [FormsModule, MoticoVSComponent],
  templateUrl: './versus.component.html',
  styleUrl: './versus.component.css'
})
export class VersusComponent {
  motoService=inject(ComparacionService)
  arreglo: Motocicleta []=[]
  arregloMotoSeleccionada: Motocicleta[]=[]

  findMotos(event:Event){

    const valor = (event.target as HTMLInputElement).value

    this.arreglo=this.motoService.findMotos(valor)
    console.log(this.arreglo)
  }

  agregarMoto(moto:Motocicleta){
    this.arregloMotoSeleccionada=[...this.arregloMotoSeleccionada,moto]
    console.log(moto)
  }

  cerrar=(index:number)=>{
    console.log(this.arregloMotoSeleccionada)
    this.arregloMotoSeleccionada.splice(index,1)
    console.log(index)
  }
}
