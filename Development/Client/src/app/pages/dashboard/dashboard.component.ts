import { Component, OnInit, ViewChild } from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
// Components
import { HeaderDashboardComponent } from 'src/app/shared/header-dashboard/header-dashboard.component';
// Services
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  // Componente ViewChild para interactuar con los metodos de header-dashboard.component.ts
  @ViewChild('headerDashboard') headerDashboardComponent: HeaderDashboardComponent;
  // toggled = true means that the item is shown
  toggledSidebar = true;
  // Usuario en sesion
  sessionUser: any;
  constructor(
    private breakpointObserver: BreakpointObserver,
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
          this.setSidebarState(false);
        } else {
          // Sidebar shown
          this.setSidebarState(true);
        }
      });
    // Obtener informacion de usuario logueado y asignarlo a la variable en header-dashboard
    this.authService.getSessionUser()
      .subscribe({
        next: (res) => {
          this.sessionUser = res?.data;
          this.headerDashboardComponent.sessionUser = this.sessionUser;
        }
      })
  }

  // Get sidebar state
  getSidebarState() {
    return this.toggledSidebar;
  }

  // Set sidebar state
  setSidebarState(state: boolean) {
    console.log("Toggled:", state);
    this.toggledSidebar = state;
  }

  // Change state of toggledSidebar (true = shown, false = hidden)
  toggleSidebar() {
    this.setSidebarState(!this.getSidebarState());
  }

}
