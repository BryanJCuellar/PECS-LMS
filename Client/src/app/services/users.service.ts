import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  // Cambiar ruta ya puesto en produccion
  backendHost: string = 'http://localhost:8888';

  constructor(private httpClient: HttpClient) { }

  /***Registro***/
  // Registro usuario
  registerUser(data: any): Observable<any> {
    return this.httpClient.post(`${this.backendHost}/users/signup`, data);
  }
  // Validar email
  validateEmail(data: any): Observable<any> {
    return this.httpClient.post(`${this.backendHost}/users/signup/validateEmail`, data);
  }
  // Validar username
  validateUsername(data: any): Observable<any> {
    return this.httpClient.post(`${this.backendHost}/users/signup/validateUsername`, data);
  }
  // Informacion para habilitar link de enviar email de registro
  enableLinkEmail(idUsuario: any, codigo: any): Observable<any> {
    return this.httpClient.get(`${this.backendHost}/users/${idUsuario}/${codigo}/enableLinkEmail`, {});
  }
  // Enviar de nuevo el email de registro
  sendEmailRegister(data: any): Observable<any> {
    return this.httpClient.post(`${this.backendHost}/users/sendEmail/verifyAccount`, data);
  }
  /***Login***/
  // Habilitar el login para activar cuenta
  enableVerifyAccount(idUsuario: any, codigo: any): Observable<any> {
    return this.httpClient.get(`${this.backendHost}/users/${idUsuario}/${codigo}/enableVerifyAccount`, {});
  }
}
