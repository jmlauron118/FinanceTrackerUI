import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { AuthService } from '@services/login/auth.service';
import { SnackbarService } from '@services/snackbar.service';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Output() toggleSidebar = new EventEmitter<void>();

  constructor (
    private authService: AuthService,
    private snackbar: SnackbarService,
  ) {}

  logout() {
    this.authService.logout();
    this.snackbar.success('Logout successfully!');
  }

  onToggleSideClick() {
    this.toggleSidebar.emit();
  }
}
