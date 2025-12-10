import { Component, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { HeaderComponent } from "./header/header.component";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { FooterComponent } from './footer/footer.component';
import { filter } from 'rxjs/operators';
import { UserModules } from '@interfaces/usermanager/user-modules';
import { AuthService } from '@services/login/auth.service';
import { SnackbarService } from '@services/snackbar.service';
import { LoadingComponent } from './loading/loading/loading.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, SidebarComponent, FooterComponent, CommonModule, LoadingComponent],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})

export class LayoutComponent {
  isLoginRoute = false;
  userModules: UserModules[] = [];
  isSidebarOpen = false;
  currentModule = "";
  loadLayout = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private snackbar: SnackbarService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        if (!this.loadLayout) {
          const url = event.urlAfterRedirects;
          
          if(isPlatformBrowser(this.platformId)) {
            const token = localStorage.getItem('ft_access_token');

            if (!token) {
              this.isLoginRoute = true;
            }
            else {
              this.isLoginRoute = false;
              this.loadLayout = true;

              if(url === '/' || url === '') {
                authService.getUserModules().subscribe({
                  next: response => {
                    const defaultModule = authService.getDefaultModule(response.data);

                    router.navigate([defaultModule.modulePage])
                  }
                });
              }
              else{
                router.navigate([url]);
              }
            }
          }

        }
      });
  }

  ngOnInit() {
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

  onCloseSideBar(newValue="") {
    this.isSidebarOpen = false;
    this.currentModule = newValue;
  }
}
