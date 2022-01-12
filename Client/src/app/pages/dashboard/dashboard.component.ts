import { AfterViewInit, Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { SidebarService } from 'src/app/services/sidebar.service';

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
export class DashboardComponent implements OnInit, AfterViewInit {
  menus: any = [];
  // toggled = false means that the element is shown
  toggledSidebar = false;
  toggledProgramsMenu = false;
  constructor(
    private breakpointObserver: BreakpointObserver,
    public sidebarservice: SidebarService
  ) {
    this.menus = sidebarservice.getMenuList();
  }

  ngOnInit(): void {
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
  }

  ngAfterViewInit(): void {

  }

  /*toggle(currentMenu) {
    if (currentMenu.type === 'dropdown') {
      this.menus.forEach(element => {
        if (element === currentMenu) {
          currentMenu.active = !currentMenu.active;
        } else {
          element.active = false;
        }
      });
    }
  }

   toggle() {
    this.toggled = !this.toggled;
  }
  */

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

}
