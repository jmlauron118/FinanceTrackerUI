import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@services/login/auth.service';

@Component({
  selector: 'app-forbidden',
  imports: [],
  templateUrl: './forbidden.component.html',
  styleUrls: ['./forbidden.component.scss']
})
export class ForbiddenComponent {
  constructor (private authService: AuthService, private router: Router) {}

  goBack(): void {
    this.authService.getUserModules().subscribe({
      next: modules => {
        const module = modules[0];

        this.router.navigate([`/${module.modulePage.toLowerCase()}`]);
      }
    });
  }
}
