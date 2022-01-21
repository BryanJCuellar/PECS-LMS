import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
// AuthGuard: No permitir acceso a paginas que requieran sesion
export class AuthGuard implements CanActivate {
  estado: boolean = false;
  constructor(
    private router: Router,
    private authService: AuthService
  ) { }
  canActivate() {
    this.authService.isLoggedIn()
      .subscribe({
        next: (res) => {
          if (res.loggedIn) {
            // Hay sesion, permitir acceso
            this.estado = true;
          } else {
            // No hay sesion, redireccionar a login
            this.estado = false;
            this.router.navigate(['/login']);
          }
        }
      });
    return this.estado;
  }

}
