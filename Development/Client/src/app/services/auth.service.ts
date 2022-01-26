import { Injectable } from '@angular/core';
import { GLOBAL } from './global';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
// Servicio para autenticación de usuario
export class AuthService {
  // Ruta API Server
  API_URL: string;

  constructor(private httpClient: HttpClient) { 
    // Ruta del servidor igual a la url almacenada en global.ts
    this.API_URL = GLOBAL.url;
  }

  /***Login***/
  // Login usuario
  loginUser(data: any): Observable<any> {
    return this.httpClient.post(`${this.API_URL}/users/login`, data, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }
  // Login usuario y activar cuenta (Actualizar estado = 1)
  loginUserAndVerify(data: any): Observable<any> {
    return this.httpClient.put(`${this.API_URL}/users/login/verifyAccount`, data, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }
  // Informacion usuario logueado
  getSessionUser(): Observable<any> {
    return this.httpClient.get(`${this.API_URL}/users/sessionUser`, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }
  /***Logout***/
  logoutUser(): Observable<any> {
    return this.httpClient.get(`${this.API_URL}/users/logout`, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }
}
