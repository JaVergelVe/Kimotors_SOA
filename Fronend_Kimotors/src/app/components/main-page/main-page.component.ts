import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';


@Component({
  selector: 'app-main-page',
  imports: [RouterLink,CommonModule],
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
