import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
// AuthGuard: No permitir acceso a paginas que requieran sesion
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private cookieService: CookieService
  ) { }

  canActivate() {
    if (this.cookieService.check('connect.sid')) {
      // Hay sesion, permitir acceso
      return true;
    }
    // No hay sesion, redireccionar a login
    this.router.navigate(['/login']);
    return false;
  }
}
