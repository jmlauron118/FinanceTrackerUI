import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

const ICON_BG_MAP: Record<string, string> = {
    success: 'success',
    warning: 'warning',
    danger: 'danger',
    info: 'info',
    question: 'info',
    default: 'default'
};

@Component({
  selector: 'app-confirm-dialog',
  imports: [CommonModule, MatButtonModule, MatDialogTitle, MatDialogContent, MatDialogActions, MatIconModule],
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title?: string, message?: string, confirmText?: string; cancelText?: string; icon?: string, color: string }
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  setColor(icon: string): string {
    return icon ? ICON_BG_MAP[icon] || icon : ICON_BG_MAP['default'];
  }
}
