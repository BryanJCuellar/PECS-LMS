import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { throwError, catchError, Observable } from 'rxjs';
import { AlertifyService } from './alertify.service';

@Injectable({
    providedIn: 'root'
})

// Servicio para interceptar errores de peticiones Http y mostrarlos con AlertifyJS
export class HttpErrorInterceptorService implements HttpInterceptor {

    constructor(
        private router: Router,
        private alertifyService: AlertifyService
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log("Http request started");
        return next.handle(request)
            .pipe(
                catchError((error: HttpErrorResponse) => {
                    console.log(error);
                    const errorMessage = this.setError(error);
                    switch (error.status) {
                        case 0:
                            // Server down, status = 0
                            this.router.navigate(['/503']);
                            break;
                        default:
                            this.alertifyService.error(errorMessage);
                            break;
                    }
                    return throwError(() => error.statusText);
                })
            );
    }
    setError(error: HttpErrorResponse): string {
        // When server is down or unknown error, it will display this message
        let errorMessage = 'Unknown error occurred';
        if (error.error instanceof ErrorEvent) {
            // Client Side Error
            errorMessage = error.error.message;
        } else {
            // Server Side Error
            switch (error.status) {
                case 0:
                    break;
                case 400:
                    errorMessage = error.error;
                    break;
                case 401:
                    errorMessage = error.error;
                    break;
                case 500:
                    if (error.error.errorMessage?.code) {
                        errorMessage = error.error.errorMessage?.code;
                    }
                    break;
                default:
                    break;
            }
        }
        return errorMessage;
    }
}