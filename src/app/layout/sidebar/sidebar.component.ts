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
  @Input() userModules: UserModules[] = [];
  @Input() isOpen = false;
  @Output() closeSidebar = new EventEmitter<void>();

  constructor (
  ) {}

  onOverlayClick() {
    this.closeSidebar.emit();
  }
}
