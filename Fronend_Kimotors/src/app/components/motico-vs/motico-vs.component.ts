import { Component, Input } from '@angular/core';
import { Motocicleta } from '../../services/moto.service';

@Component({
  selector: 'app-motico-vs',
  imports: [],
  templateUrl: './motico-vs.component.html',
  styleUrl: './motico-vs.component.css'
})
export class MoticoVSComponent {
  @Input() moto!: Motocicleta;
  @Input() fn!: (index:number) => void;
  @Input() index!:number;

  cierre(){
    this.fn(this.index);
  }
}
