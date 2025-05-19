import { Component, OnDestroy } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthFirebaseService } from '../../services/authFireBase.service';
import { MotoService } from '../../services/moto.service';
import { Subject, debounceTime, distinctUntilChanged, filter, map, takeUntil } from 'rxjs';

@Component({
  selector: 'app-encabezado',
  imports: [RouterLink, CommonModule, RouterLinkActive],
  standalone: true,
  templateUrl: './encabezado.component.html',
  styleUrl: './encabezado.component.css'
})
export class EncabezadoComponent implements OnDestroy {
  private destroy$ = new Subject<void>();
  resultadosBusqueda: any[] = [];
  mostrarResultados = false;

  constructor(
    private router: Router,
    private motoService: MotoService,
    private authFirebaseService: AuthFirebaseService
  ) {}

  get showLoginButton(): boolean {
    return !localStorage.getItem('currentUser') && !this.authFirebaseService.isAuthenticated;
  }

  handleAuthAction(event: MouseEvent): void {
    event.preventDefault();
    
    if (this.showLoginButton) {
      // Si no está autenticado, navegar a login
      this.router.navigate(['/login']);
    } else {
      // Si está autenticado, navegar al perfil
      this.router.navigate(['/user-profile']);
    }
  }

  buscarMotos(event: any) {
    const texto = event.target.value;
    if (texto.length >= 2) {
      this.motoService.nombreCompletoMotos()
        .pipe(
          debounceTime(300),
          distinctUntilChanged(),
          map(motos => motos.filter(moto => 
            moto.fullName.toLowerCase().includes(texto.toLowerCase())
          )),
          takeUntil(this.destroy$)
        )
        .subscribe(resultados => {
          this.resultadosBusqueda = resultados;
          this.mostrarResultados = true;
        });
    } else {
      this.resultadosBusqueda = [];
      this.mostrarResultados = false;
    }
  }

  seleccionarMoto(moto: any) {
    this.router.navigate(['/moto', moto.marca, moto.modelo]);
    this.mostrarResultados = false;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}