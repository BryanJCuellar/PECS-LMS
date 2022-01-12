import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  backendHost: string = 'http://localhost:8888';

  constructor(private httpClient: HttpClient) { }

  // Registro usuario
  registerUser(data: any): Observable<any> {
    return this.httpClient.post(`${this.backendHost}/users/signup`, data);
  }
  // Informacion para enviar correo
  enableLinkEmail(idUsuario: any): Observable<any> {
    return this.httpClient.get(`${this.backendHost}/users/${idUsuario}/email`, {});
  }
  // Enviar correo de nuevo
  sendEmail(data: any): Observable<any> {
    return this.httpClient.post(`${this.backendHost}/users/signup/send-email/verify-account`, data);
  }
}
