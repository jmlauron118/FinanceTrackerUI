import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ModuleActionResponseDto } from '@interfaces/usermanager/module-actions-dto/module-action-response-dto';
import { UsermanagerService } from '@services/usermanager/usermanager.service';
import { SnackbarService } from '@services/snackbar.service';
import { ModuleActionDialogComponent } from './module-action-dialog/module-action-dialog.component';
import { ConfirmDialogComponent } from 'app/shared/confirm-dialog/confirm-dialog.component';
import { FormsModule } from '@angular/forms';
import { ConfirmDialogService } from '@services/confirm-dialog.service';

@Component({
  selector: 'app-module-actions',
  imports: [CommonModule, FormsModule],
  templateUrl: './module-actions.component.html',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None
})
export class ModuleActionsComponent {
  moduleActions: ModuleActionResponseDto[] = [];

  filteredData = [...this.moduleActions];
  searchBar = '';

  constructor(
    private usermanagerService: UsermanagerService,
    private dialog: MatDialog,
    private snackbar: SnackbarService,
    private confirm: ConfirmDialogService
  ) {}

  getAllModuleActions(): void {
    this.searchBar = '';
    this.usermanagerService.getAllModuleActions().subscribe({
      next: response => {
        this.moduleActions = response.data;
        this.filteredData = [...response.data];
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
      next: response => {
        this.snackbar.success(response.message);
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
        this.getAllModuleActions();
      }
    });
  }

  openEditModuleActionDialog(moduleAction: ModuleActionResponseDto): void {
    const dialogRef = this.dialog.open(ModuleActionDialogComponent, {
      panelClass: 'custom-dialog',
      width: '500px',
      maxWidth: '90vw',
      data: moduleAction
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.getAllModuleActions();
      }
    });
  }

  confirmDelete(id: number): void {
    this.confirm.openConfirm({
      title: 'Remove Module Action',
      message: 'Are you sure you want to remove this module action?',
      icon: 'warning'
    }).subscribe(result => {
      if(result) this.removeModuleAction(id);
    });
  }
}
