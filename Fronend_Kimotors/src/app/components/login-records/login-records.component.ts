import { Component, OnInit } from '@angular/core';
import { AuthService, LoginRecord } from '../../services/auth.service';

@Component({
  selector: 'app-login-records',
  imports: [],
  templateUrl: './login-records.component.html',
  styleUrl: './login-records.component.css'
})
export class LoginRecordsComponent implements OnInit{
  loginRecords: LoginRecord[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.getLoginRecords();
  }

  getLoginRecords(): void {
    this.authService.getAllLoginRecords().subscribe({
      next: (records) => {
        this.loginRecords = records;
        this.loginRecordAux= records;
        console.log('Registros de login obtenidos:', records);
      },
      error: (err) => {
        console.error('Error al obtener los registros de login:', err);
      }
    });

  }
  email:string ="";
  date:string="";
  loginRecordAux: LoginRecord[] = [];
  //filtro a los usuarios por el correo
  filtrarUsuario(event: Event){
    const valor = (event.target as HTMLInputElement).value
    this.email=valor;
    this.loginRecords=this.loginRecordAux.filter((record)=>record.email.toLowerCase().includes(this.email.toLowerCase()) && record.loginTimestamp.toString().toLowerCase().includes(this.date.toLowerCase()))
  }
  //filtrar usuario por fecha
  filtrarUsuarioFecha(event: Event){
    const valor = (event.target as HTMLInputElement).value
    console.log(valor)
    this.date=valor;
    this.loginRecords=this.loginRecordAux.filter((record)=>record.email.toLowerCase().includes(this.email.toLowerCase() ) && record.loginTimestamp.toString().toLowerCase().includes(this.date.toLowerCase()))
  }
}
