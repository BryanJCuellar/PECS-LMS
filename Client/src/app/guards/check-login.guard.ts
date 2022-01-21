import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
// CheckLoginGuard: No permitir acceso a login o signup si hay sesion
export class CheckLoginGuard implements CanActivate {
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
            // Hay sesion, redireccionar a dashboard
            this.estado = false;
            this.router.navigate(['/dashboard']);
          }else{
            // No hay sesion, permitir acceso
            this.estado = true;
          }
        }
      })
    return this.estado;
  }

}
