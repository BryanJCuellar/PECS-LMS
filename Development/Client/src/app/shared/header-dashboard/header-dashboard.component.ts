import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { trigger, style, transition, animate } from '@angular/animations';
import { Router } from '@angular/router';
// Services
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header-dashboard',
  templateUrl: './header-dashboard.component.html',
  styleUrls: ['./header-dashboard.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [   // :enter is alias to 'void => *'
        style({ opacity: 0 }),
        animate(500, style({ opacity: 1 }))
      ]),
      transition(':leave', [   // :leave is alias to '* => void'
        animate(500, style({ opacity: 0 }))
      ])
    ])
  ]
})
export class HeaderDashboardComponent implements OnInit {
  // Input decorator
  @Input() toggledSidebarItem: boolean;
  // Output decorator
  @Output() onToggleSidebar = new EventEmitter();
  // Usuario en sesion
  sessionUser: any;
  constructor(
    private router: Router,
    private alertifyService: AlertifyService,
    private authService: AuthService
  ) { }

  ngOnInit(): void { }

  // Emitir un evento al componente Dashboard para cambiar el estado del sidebar
  toggleSidebarInNav() {
    this.onToggleSidebar.emit("Toggle Sidebar");
  }

  // Cerrar sesión
  logout() {
    this.authService.logoutUser()
      .subscribe({
        next: (res) => {
          if (res.message == 'Logout exitoso') {
            this.alertifyService.success(res.message);
            this.router.navigate(['/login']);
          }
        }
      });
  }

}
