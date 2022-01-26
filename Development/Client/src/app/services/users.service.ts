import { Injectable } from '@angular/core';
import { GLOBAL } from './global';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
// Servicio para manejar peticiones sobre los usuarios
export class UsersService {
  // Ruta API Server
  API_URL: string;

  constructor(private httpClient: HttpClient) {
    // Ruta del servidor igual a la url almacenada en global.ts
    this.API_URL = GLOBAL.url;
  }

  /***Registro***/
  // Registro usuario
  registerUser(data: any): Observable<any> {
    return this.httpClient.post(`${this.API_URL}/users/signup`, data);
  }
  // Validar email
  validateEmail(data: any): Observable<any> {
    return this.httpClient.post(`${this.API_URL}/users/signup/validateEmail`, data);
  }
  // Validar username
  validateUsername(data: any): Observable<any> {
    return this.httpClient.post(`${this.API_URL}/users/signup/validateUsername`, data);
  }
  // Informacion para habilitar link de enviar email de registro
  enableLinkEmail(idUsuario: any, codigo: any): Observable<any> {
    return this.httpClient.get(`${this.API_URL}/users/${idUsuario}/${codigo}/enableLinkEmail`, {});
  }
  // Enviar de nuevo el email de registro
  sendEmailRegister(data: any): Observable<any> {
    return this.httpClient.post(`${this.API_URL}/users/sendEmail/verifyAccount`, data);
  }
  /***Login***/
  // Habilitar el login para activar cuenta
  enableVerifyAccount(idUsuario: any, codigo: any): Observable<any> {
    return this.httpClient.get(`${this.API_URL}/users/${idUsuario}/${codigo}/enableVerifyAccount`, {});
  }
}
