import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
// CheckLoginGuard: No permitir acceso a login o signup si hay sesion
export class CheckLoginGuard implements CanActivate {

  constructor(
    private router: Router,
    private cookieService: CookieService
  ) { }

  canActivate() {
    if(this.cookieService.check('connect.sid')){
      // Hay sesion, redireccionar a dashboard
      this.router.navigate(['/dashboard']);
      return false;
    }
    // No hay sesion, permitir acceso
    return true;
  }

}
