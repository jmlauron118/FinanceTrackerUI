import { Component, ViewChild, ElementRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./header/header.component";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { FooterComponent } from './footer/footer.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, SidebarComponent, FooterComponent],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})

export class LayoutComponent {
  @ViewChild('sidebar', {read: ElementRef}) sidebarRef!: ElementRef;

  userModules = ['dashboard', 'usermanager'];
  isSidebarOpen = false;

  onToggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen
  }
}
