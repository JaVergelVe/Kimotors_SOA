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
        console.log('Registros de login obtenidos:', records);
      },
      error: (err) => {
        console.error('Error al obtener los registros de login:', err);
      }
    });
  }
}
