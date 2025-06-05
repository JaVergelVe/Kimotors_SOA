import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Comentario {
    id?: string;
    texto: string;
    userEmail: string;
    motoMarca: string;
    motoModelo: string;
    fecha?: string;
}

@Injectable({
    providedIn: 'root'
})
export class ComentarioService {
    private apiUrl = `http://localhost:8080/comentarios`;

    constructor(private http: HttpClient) {}

    agregarComentario(comentario: Comentario): Observable<Comentario> {
        return this.http.post<Comentario>(this.apiUrl, comentario);
    }

    obtenerComentariosPorMoto(marca: string, modelo: string): Observable<Comentario[]> {
        return this.http.get<Comentario[]>(`${this.apiUrl}/moto/${marca}/${modelo}`);
    }

    obtenerComentariosPorUsuario(email: string): Observable<Comentario[]> {
        return this.http.get<Comentario[]>(`${this.apiUrl}/usuario/${email}`);
    }

    eliminarComentario(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}