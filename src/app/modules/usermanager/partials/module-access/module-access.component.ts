import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { UsermanagerService } from '@services/usermanager/usermanager.service';
import { SnackbarService } from '@services/snackbar.service';
import { ModuleAccessResponseDto } from '@interfaces/usermanager/module-access-dto/module-access-response-dto';
import { ModuleAccessDialogComponent } from './module-access-dialog/module-access-dialog.component';
import { ModuleAccessModifyDto } from '@interfaces/usermanager/module-access-dto/module-access-modify-dto';
import { ConfirmDialogComponent } from 'app/shared/confirm-dialog/confirm-dialog.component';
import { FormsModule } from '@angular/forms';
import { ConfirmDialogService } from '@services/confirm-dialog.service';

@Component({
  selector: 'app-module-access',
  imports: [CommonModule, FormsModule],
  templateUrl: './module-access.component.html',
  styleUrls: ['./module-access.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ModuleAccessComponent {
  moduleAccess: ModuleAccessResponseDto[] = [];

  filteredData = [...this.moduleAccess];
  searchBar = '';

  constructor(
    private usermanagerService: UsermanagerService,
    private dialog: MatDialog,
    private snackbar: SnackbarService,
    private confirm: ConfirmDialogService
  ) {}

  getAllModuleAccess(): void {
    this.searchBar = '';
    this.usermanagerService.getAllModuleAccess().subscribe({
      next: data => {
        this.moduleAccess = data;
        this.filteredData = [...data];
      },
      error: err => (this.snackbar.danger(err, 5000))
    });
  }

  applyFilter(): void {
    const term = this.searchBar.toLowerCase().trim();

    this.filteredData = this.moduleAccess.filter(mac => 
      Object.values(mac).some(value =>
        value && value.toString().toLowerCase().includes(term)
      )
    );
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
        this.getAllModuleAccess();
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
    this.confirm.openConfirm({
      title: 'Remove Module Access',
      message: 'Are you sure you want to remove this module access?',
      icon: 'warning'
    }).subscribe(result => {
      if(result) this.removeModuleAccess(id);
    });
  }
}
