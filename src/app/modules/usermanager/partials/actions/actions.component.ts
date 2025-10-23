import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionResponseDto } from '@interfaces/usermanager/actions-dto/action-response-dto';
import { UsermanagerService } from '@services/usermanager/usermanager.service';
import { SnackbarService } from '@services/snackbar.service';
import { MatDialog } from '@angular/material/dialog';
import { ActionDialogComponent } from './action-dialog/action-dialog.component';
import { ActionModifyDto } from '@interfaces/usermanager/actions-dto/action-modify-dto';

@Component({
  selector: 'app-actions',
  imports: [CommonModule],
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ActionsComponent {
  actions: ActionResponseDto[] = [];

  constructor(
    private usermanagerService: UsermanagerService,
    private snackbar: SnackbarService,
    private dialog: MatDialog
  ) {}

  getAllActions(): void {
    this.usermanagerService.getAllActions().subscribe({
      next: data => (this.actions = data),
      error: err => (this.snackbar.danger(err, 5000))
    });
  }

  openAddActionDialog(): void {
    const dialogRef = this.dialog.open(ActionDialogComponent, {
      panelClass: 'custom-dialog',
      width: '400px',
      maxWidth: '90vw'
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.actions.push(result);
      }
    });
  }

  openEditActionDialog(action: ActionModifyDto): void {
    const dialogRef = this.dialog.open(ActionDialogComponent, {
      panelClass: 'custom-dialog',
      width: '400px',
      maxWidth: '90vw',
      data: {
        action
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.getAllActions();
      }
    });
  }
}
