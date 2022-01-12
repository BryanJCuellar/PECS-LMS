import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// Services
import { TestConnectionService } from 'src/app/services/test-connection.service';

@Component({
  selector: 'app-server-error',
  templateUrl: './server-error.component.html',
  styleUrls: ['./server-error.component.scss']
})
export class ServerErrorComponent implements OnInit {

  constructor(
    private router: Router,
    private testConn: TestConnectionService
  ) { }

  ngOnInit(): void {
    this.testConn.checkDBConnection()
      .subscribe(
        res => {
          if(res.message == 'consulta exitosa'){
            this.router.navigate([`/home`]);
          }
        }
      );
  }

}
