import { Injectable } from '@angular/core';
import { GLOBAL } from './global';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
// Servicio para testear conexion entre el servidor y la base de datos si se encuentra en la ruta 503
export class TestConnectionService {
  // Ruta API Server
  API_URL: string;

  constructor(private httpClient: HttpClient) {
    // Ruta del servidor igual a la url almacenada en global.ts
    this.API_URL = GLOBAL.url;
  }

  checkDBConnection(): Observable<any> {
    return this.httpClient.get(`${this.API_URL}/testConn`, {});
  }
}
