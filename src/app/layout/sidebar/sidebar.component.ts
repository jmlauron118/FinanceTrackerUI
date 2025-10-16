import { Component, Input, Output, EventEmitter } from '@angular/core';
import { UserModules } from '../../interfaces/usermanager/user-modules';
import { NgForOf, CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NgForOf, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})

export class SidebarComponent {
  @Input() userModules: string[] = [];
  @Input() isOpen = false;
  @Output() closeSidebar = new EventEmitter<void>();

  menuItems: UserModules[] =[
    { moduleName: 'Dashboard', modulePage: 'dashboard', icon: 'fa fa-fw fa-home' },
    { moduleName: 'User Manager', modulePage: 'usermanager', icon: 'fa fa-fw fa-users' }
  ];

  get visibleMenu() {
    return this.menuItems.filter(item =>
      this.userModules.includes(item.modulePage)
    );
  }

  onOverlayClick() {
    this.closeSidebar.emit();
  }
}
