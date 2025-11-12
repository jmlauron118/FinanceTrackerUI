import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule, FormGroup, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '@services/login/auth.service';
import { Router } from '@angular/router';
import { MaterialModule } from 'app/shared/material.module';
import { LoginCreds } from '@interfaces/login/login-creds';
import { SnackbarService } from '@services/snackbar.service';


@Component({
  selector: 'app-login',
  imports: [FormsModule, ReactiveFormsModule, CommonModule, MaterialModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm!: FormGroup;
  loading = false;
  errorMessage = 'test error';
  hidePassword = true;
  isVisible = false;

  constructor (
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackbar: SnackbarService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.loginForm = this.fb.group({
      username: ['jmlauron118', Validators.required],
      password: ['@dm1n011896', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]]
    });
  }

  ngOnInit() {
    if(isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('ft_access_token');
      
      if (token) {
        this.router.navigateByUrl('/dashboard');
      } else {
        this.isVisible = true;
        console.log('login loaded');
      }
    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    const creds: LoginCreds = this.loginForm.value;

    this.authService.login(creds).subscribe({
      next: res => {
        if(Array.isArray(res.modules) && res.modules.length === 0) {
          this.snackbar.warning("No module(s) assigned. Please contact the administrator.", 4000);
          return;
        }

        const defaultModule = res.modules[0];

        this.router.navigate([defaultModule.modulePage.toLowerCase()]);
      },
      error: err => (this.snackbar.danger(err, 5000))
    });
  }

  get loginControl() {
    return this.loginForm.controls;
  }
}
