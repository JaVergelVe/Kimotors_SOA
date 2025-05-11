import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TarjetaMotoComponent } from '../tarjeta-moto/tarjeta-moto.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-main-page',
  imports: [CommonModule, TarjetaMotoComponent, FormsModule],
  standalone: true,
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css'
})
export class MainPageComponent {
  isDisplayMenu=false
  displayMenuClass={contenedorMovido:this.isDisplayMenu}
  changeDisplay(){
    this.isDisplayMenu=!this.isDisplayMenu
    this.displayMenuClass.contenedorMovido=this.isDisplayMenu
  }

}
