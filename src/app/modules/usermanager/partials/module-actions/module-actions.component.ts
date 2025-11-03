import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ModuleActionResponseDto } from '@interfaces/usermanager/module-actions-dto/module-action-response-dto';
import { UsermanagerService } from '@services/usermanager/usermanager.service';
import { SnackbarService } from '@services/snackbar.service';
import { ModuleActionDialogComponent } from './module-action-dialog/module-action-dialog.component';
import { ConfirmDialogComponent } from 'app/shared/confirm-dialog/confirm-dialog.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-module-actions',
  imports: [CommonModule, FormsModule],
  templateUrl: './module-actions.component.html',
  styleUrls: ['./module-actions.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ModuleActionsComponent {
  moduleActions: ModuleActionResponseDto[] = [];

  filteredData = [...this.moduleActions];
  searchBar = '';

  constructor(
    private usermanagerService: UsermanagerService,
    private dialog: MatDialog,
    private snackbar: SnackbarService
  ) {}

  getAllModuleActions(): void {
    this.searchBar = '';
    this.usermanagerService.getAllModuleActions().subscribe({
      next: data => {
        this.moduleActions = data;
        this.filteredData = [...data];
      },
      error: err => (this.snackbar.danger(err, 5000))
    });
  }

  applyFilter(): void {
    const term = this.searchBar.toLowerCase().trim();

    this.filteredData = this.moduleActions.filter(ma => 
      Object.values(ma).some(value =>
        value && value.toString().toLowerCase().includes(term)
      )
    );
  }

  removeModuleAction(id: number): void {
    this.usermanagerService.removeModuleAction(id).subscribe({
      next: () => {
        this.snackbar.success('Module action has been removed!');
        this.getAllModuleActions();
      },
      error: err => (this.snackbar.danger(err, 5000))
    });
  }

  openAddModuleActionDialog(): void {
    const dialogRef = this.dialog.open(ModuleActionDialogComponent, {
      panelClass: 'custom-dialog',
      width: '400px',
      maxWidth: '90vw'
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.moduleActions.push(result);
      }
    });
  }

  openEditModuleActionDialog(moduleAction: ModuleActionResponseDto): void {
    const dialogRef = this.dialog.open(ModuleActionDialogComponent, {
      panelClass: 'custom-dialog',
      width: '500px',
      maxWidth: '90vw',
      data: {
        moduleAction
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.getAllModuleActions();
      }
    });
  }

  confirmDelete(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      panelClass: 'custom-dialog',
      data: {
        title: 'Delete Module Action',
        message: 'Are you sure you want to delete this module action?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.removeModuleAction(id);
      }
    });
  }
}
