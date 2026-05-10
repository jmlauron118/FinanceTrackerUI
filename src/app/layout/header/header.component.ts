import { Component, EventEmitter, Output, ViewEncapsulation, Inject, ViewChild } from '@angular/core';
import { AuthService } from '@services/login/auth.service';
import { SnackbarService } from '@services/snackbar.service';
import { MatDialog } from '@angular/material/dialog';
import { ChangePasswordDialogComponent } from './change-password-dialog/change-password-dialog.component';
import { ConfirmDialogService } from '@services/confirm-dialog.service';
import { Renderer2 } from '@angular/core';
import { DOCUMENT, CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ChartComponent } from 'ng-apexcharts';
import { ThemeService } from '@services/theme.service';

declare var bootstrap: any;

@Component({
  selector: 'app-header',
  imports: [CommonModule, MatTooltipModule],
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent {
  @Output() toggleSidebar = new EventEmitter<void>();
  @ViewChild('chart') chart!: ChartComponent;
  username!: string;
  isDarkMode = false;

  constructor (
    private authService: AuthService,
    private snackbar: SnackbarService,
    private dialog: MatDialog,
    private confirm: ConfirmDialogService,
    private theme: ThemeService,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    this.username = this.authService.getUserInfo();
    if (typeof localStorage !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
    
      if (savedTheme) {
        this.isDarkMode = savedTheme === 'dark';
        const themeClass = this.isDarkMode ? 'dark-theme' : 'light-theme';
        this.renderer.setAttribute(this.document.body, 'class', themeClass);
      }
    }
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
        this.renderer.setAttribute(this.document.body, 'class', '');
        localStorage.removeItem('theme');
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

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    const themeClass = this.isDarkMode ? 'dark-theme' : 'light-theme';
    this.renderer.setAttribute(this.document.body, 'class', themeClass);
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');

    this.theme.setTheme(this.isDarkMode ? 'dark' : 'light');
  }
}
