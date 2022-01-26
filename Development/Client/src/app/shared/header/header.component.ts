import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  listItemActivo: any;
  constructor(
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    if (this.activatedRoute.snapshot.routeConfig?.path != '') {
      this.listItemActivo = this.activatedRoute.snapshot.url[0]?.path;
    } else {
      this.listItemActivo = 'home';
    }
  }

}
