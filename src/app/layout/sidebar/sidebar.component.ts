import { Component, Input, Output, EventEmitter } from '@angular/core';
import { UserModules } from '../../interfaces/usermanager/user-modules';
import { NgForOf, CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NgForOf, RouterLink, RouterLinkActive, CommonModule, MatTooltipModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})

export class SidebarComponent {
  @Input() userModules: UserModules[] = [];
  @Input() isOpen = false;
  @Output() closeSidebar = new EventEmitter<string>();
  @Output() reloadModule = new EventEmitter<void>();
  openParentId: number | null = null;

  constructor (
    private router: Router
  ) {}

  onOverlayClick() {
    this.closeSidebar.emit();
  }

  onSidebarClick(route: string) {
    const targetUrl = '/' + route.toLowerCase();

    if (this.router.url === targetUrl) { 
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.closeSidebar.emit(targetUrl);
        this.router.navigate([targetUrl]);
      });
    }
  }

  toggleSubMenu(parentId: number) {
    this.openParentId = this.openParentId === parentId ? null : parentId;
  }

  isSubMenuOpen(parentId: number): boolean {
    return this.openParentId === parentId;
  }


  hasChildren(module: UserModules) {
    return module.childCount !== 0;
  }

  getChildren(parentId: number) {
    return this.userModules.filter(m => m.parentId === parentId);
  }

  isChildActive(parentId: number): boolean {
    return this.userModules.some(child => child.parentId === parentId && this.router.isActive(`/${child.modulePage.toLowerCase()}`, true));
  }
}
