import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { ActivatedRoute, Router } from '@angular/router';
// Services
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [
    trigger('slide', [
      state('up', style({ height: 0 })),
      state('down', style({ height: '*' })),
      transition('up <=> down', animate(200))
    ]),
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
export class DashboardComponent implements OnInit {
  // toggled = false means that the element is shown
  toggledSidebar = false;
  toggledProgramsMenu = false;
  // Usuario en sesion
  sessionUser: any;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private breakpointObserver: BreakpointObserver,
    private alertifyService: AlertifyService,
    private authService: AuthService,
    private usersService: UsersService
  ) { }

  ngOnInit(): void {
    // Show sidebar according to the match
    this.breakpointObserver
      .observe(['(max-width: 767.98px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          // Sidebar hidden
          this.toggledSidebar = true;
        } else {
          // Sidebar shown
          this.toggledSidebar = false;
        }
      });
    this.authService.getSessionUser()
    .subscribe({
      next: (res) => {
        console.log(res);
        this.sessionUser = res?.data;
      }
    })
  }

  toggleProgramsMenu() {
    this.toggledProgramsMenu = !this.toggledProgramsMenu;
  }

  getStateProgramsMenu() {
    if (this.toggledProgramsMenu) {
      return 'up';
    } else {
      return 'down';
    }
  }

  getSidebarState() {
    return this.toggledSidebar;
  }

  setSidebarState(state: boolean) {
    this.toggledSidebar = state;
  }

  toggleSidebar() {
    this.setSidebarState(!this.getSidebarState());
  }

  logout(){
    this.authService.logoutUser()
    .subscribe({
      next: (res) => {
        if(res.message == 'Logout exitoso'){
          this.alertifyService.success(res.message);
          this.router.navigate(['/login']);
        }
      }
    });
  }

}
