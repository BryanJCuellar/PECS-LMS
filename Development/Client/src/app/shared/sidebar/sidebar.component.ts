import { Component, OnInit, Input } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  animations: [
    trigger('slide', [
      state('up', style({ height: 0 })),
      state('down', style({ height: '*' })),
      transition('up <=> down', animate(200))
    ])
  ]
})
export class SidebarComponent implements OnInit {
  // Input decorator
  @Input() toggledSidebarItem: boolean;
  // toggled = true means that the item is shown
  toggledProgramsMenu = true;

  constructor() { }

  ngOnInit(): void { }

  // Change state of toggledProgramsMenu (true = shown, false = hidden)
  toggleProgramsMenu() {
    this.toggledProgramsMenu = !this.toggledProgramsMenu;
  }

  // Get state for showing or hiding programs
  getStateProgramsMenu() {
    if (this.toggledProgramsMenu) {
      // Submenu shown
      return 'down';
    } else {
      // Submenu hidden
      return 'up';
    }
  }
}
