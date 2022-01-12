import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { throwError, catchError, Observable } from 'rxjs';
import { AlertifyService } from './alertify.service';

@Injectable({
    providedIn: 'root'
})

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
                    // Server down, status = 0
                    if(error.status == 0){
                        this.router.navigate([`/503`]);
                        return throwError(() => error.statusText);
                    }
                    this.alertifyService.error(errorMessage);
                    return throwError(() => error.statusText);
                })
            );
    }
    setError(error: HttpErrorResponse): string{
        // When server is down, it will display this message
        let errorMessage = 'Unknown error occurred';
        if (error.error instanceof ErrorEvent) {
            // Client Side Error
            errorMessage = error.error.message;
        } else {
            // Server Side Error
            if (error.status !== 0) {
                if(error.status == 500){
                    errorMessage = error.error.message?.code;
                }
            }
        }
        return errorMessage;
    }
}