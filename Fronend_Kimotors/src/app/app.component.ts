import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EncabezadoComponent } from './components/encabezado/encabezado.component';
import { AuthFirebaseService } from './services/authFireBase.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, EncabezadoComponent],
  templateUrl:'./app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(private authService: AuthFirebaseService) {}

  @HostListener('window:mousemove')
  @HostListener('window:keypress')
  resetTimer() {
    this.authService.resetTimer();
  }
}