import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {

  constructor(private snackBar: MatSnackBar) {}

  private show(
    message: string,
    panelClass: string[],
    duration: number = 3000,
  ) {
    const config: MatSnackBarConfig = {
      duration,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass,
    };
    this.snackBar.open(message, 'Close', config);
  }

  success(message: string, duration?: number) {
    this.show(`✅ ${message}`, ['snackbar-success'], duration);
  }

  danger(message: string, duration?: number) {
    this.show(`❌ ${message}`, ['snackbar-error'], duration);
  }

  warning(message: string, duration?: number) {
    this.show(`⚠️ ${message}`, ['snackbar-warning'], duration);
  }

  info(message: string, duration?: number) {
    this.show(`ℹ️ ${message}`, ['snackbar-info'], duration);
  }
}
