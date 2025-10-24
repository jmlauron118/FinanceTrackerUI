import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { UsermanagerService } from '@services/usermanager/usermanager.service';
import { SnackbarService } from '@services/snackbar.service';
import { ModuleAccessResponseDto } from '@interfaces/usermanager/module-access-dto/module-access-response-dto';
import { ModuleAccessDialogComponent } from './module-access-dialog/module-access-dialog.component';
import { ModuleAccessModifyDto } from '@interfaces/usermanager/module-access-dto/module-access-modify-dto';
import { ConfirmDialogComponent } from 'app/shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-module-access',
  imports: [CommonModule],
  templateUrl: './module-access.component.html',
  styleUrls: ['./module-access.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ModuleAccessComponent {
  moduleAccess: ModuleAccessResponseDto[] = [];

  constructor(
    private usermanagerService: UsermanagerService,
    private dialog: MatDialog,
    private snackbar: SnackbarService,
  ) {}

  getAllModuleAccess(): void {
    this.usermanagerService.getAllModuleAccess().subscribe({
      next: data => (this.moduleAccess = data),
      error: err => (this.snackbar.danger(err, 5000))
    });
  }

  removeModuleAccess(id: number): void {
    this.usermanagerService.removeModuleAccess(id).subscribe({
      next: () => {
        this.snackbar.success('Module access has been removed!');
        this.getAllModuleAccess();
      },
      error: err => (this.snackbar.danger(err, 5000))
    });
  }

  openAddModuleAccessDialog(): void {
    const dialogRef = this.dialog.open(ModuleAccessDialogComponent, {
      panelClass: 'custom-dialog',
      width: '450px',
      maxWidth: '90vw'
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.moduleAccess.push(result);
      }
    });
  }

  openEditModuleAccessDialog(moduleAccess: ModuleAccessModifyDto): void {
    const dialogRef = this.dialog.open(ModuleAccessDialogComponent, {
      panelClass: 'custom-dialog',
      width: '450px',
      maxWidth: '90vw',
      data: {
        moduleAccess
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.getAllModuleAccess();
      }
    });
  }

  confirmDelete(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
       panelClass: 'custom-dialog',
       data: {
        title: 'Remove Module Access',
        message: 'Are you sure you want to remove this module access?'
       }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.removeModuleAccess(id);
      }
    });
  }
}
