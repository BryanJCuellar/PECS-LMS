import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TestConnectionService {
  backendHost: string = 'http://localhost:8888';

  constructor(private httpClient: HttpClient) { }

  checkDBConnection(): Observable<any> {
    return this.httpClient.get(`${this.backendHost}/testConn`, {});
  }
}
