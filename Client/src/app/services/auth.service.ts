import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Cambiar ruta ya puesto en produccion
  backendHost: string = 'http://localhost:8888';

  constructor(private httpClient: HttpClient) { }

  /***Login***/
  // Login usuario
  loginUser(data: any): Observable<any> {
    return this.httpClient.post(`${this.backendHost}/users/login`, data, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }
  // Login usuario y activar cuenta (Actualizar estado = 1)
  loginUserAndVerify(data: any): Observable<any> {
    return this.httpClient.put(`${this.backendHost}/users/login/verifyAccount`, data, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }
  // Informacion usuario logueado
  getSessionUser(): Observable<any> {
    return this.httpClient.get(`${this.backendHost}/users/sessionUser`, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }
  /***Logout***/
  logoutUser(): Observable<any> {
    return this.httpClient.get(`${this.backendHost}/users/logout`, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }
}
