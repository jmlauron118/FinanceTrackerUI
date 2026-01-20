import { Component, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import { AuthService } from '@services/login/auth.service';
import { SnackbarService } from '@services/snackbar.service';
import { MatDialog } from '@angular/material/dialog';
import { ChangePasswordDialogComponent } from './change-password-dialog/change-password-dialog.component';
import { ConfirmDialogService } from '@services/confirm-dialog.service';
declare var bootstrap: any;

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent {
  @Output() toggleSidebar = new EventEmitter<void>();
  username!: string;

  constructor (
    private authService: AuthService,
    private snackbar: SnackbarService,
    private dialog: MatDialog,
    private confirm: ConfirmDialogService
  ) {}

  ngOnInit(): void {
    this.username = this.authService.getUserInfo();
  }

  logout() {
    this.confirm.openConfirm({
      title: 'Logout',
      message: 'Are you sure you want to logout?',
      confirmText: 'Logout',
      cancelText: 'Cancel',
      icon: 'warning'
    }).subscribe(confirmed => {
      if (confirmed) {
        this.authService.logout();
        this.snackbar.success("You've been logged out successfully.");
      }
    });
  }

  onToggleSideClick() {
    this.toggleSidebar.emit();
  }

  onChangePassword(): void {
    const dialogRef = this.dialog.open(ChangePasswordDialogComponent, {
      panelClass: 'custom-dialog',
      width: '500px',
      maxWidth: '90vw'
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) return;
    });
  }

  hideDropdown(button: HTMLElement) {
    const dropdown = new bootstrap.Dropdown(button);
    
    if(dropdown) dropdown.hide();
  }
}
