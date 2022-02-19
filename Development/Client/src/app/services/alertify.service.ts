import { Injectable } from '@angular/core';
import * as alertify from 'alertifyjs';

@Injectable({
  providedIn: 'root'
})
// Alertas de descripcion sobre las peticiones Http con AlertifyJS
export class AlertifyService {

  constructor() { }

  // Mensaje de éxito
  success(message: string) {
    alertify.set('notifier','position', 'top-right');
    alertify.success(message);
  }

  // Mensaje de advertencia
  warning(message: string) {
    alertify.set('notifier','position', 'top-right');
    alertify.warning(message);
  }

  // Mensaje de error
  error(message: string) {
    alertify.set('notifier','position', 'top-right');
    alertify.error(message);
  }
}
