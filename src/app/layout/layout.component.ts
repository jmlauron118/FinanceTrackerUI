import { Component, ViewChild, ElementRef, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { HeaderComponent } from "./header/header.component";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { FooterComponent } from './footer/footer.component';
import { filter } from 'rxjs/operators';
import { UserModules } from '@interfaces/usermanager/user-modules';
import { AuthService } from '@services/login/auth.service';
import { SnackbarService } from '@services/snackbar.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, SidebarComponent, FooterComponent, CommonModule],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})

export class LayoutComponent {
  @ViewChild('sidebar', {read: ElementRef}) sidebarRef!: ElementRef;
  isLoginRoute = false;
  userModules: UserModules[] = [];
  isSidebarOpen = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private snackbar: SnackbarService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.isLoginRoute = event.urlAfterRedirects === '/login';
      });
  }

  ngOnInit() {
    console.log('layout loaded');

    if(isPlatformBrowser(this.platformId)) {
      this.authService.getUserModules().subscribe({
        next: response => (this.userModules = response.data),
        error: err => (this.snackbar.danger(err, 4000))
      });
    }
  }

  onToggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen
  }
}
