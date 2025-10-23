import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsermanagerService } from '@services/usermanager/usermanager.service';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarService } from '@services/snackbar.service';
import { ModuleResponseDto } from '@interfaces/usermanager/modules-dto/module-response-dto';
import { ModuleDialogComponent } from './module-dialog/module-dialog.component';

@Component({
  selector: 'app-modules',
  imports: [CommonModule],
  templateUrl: './modules.component.html',
  styleUrls: ['./modules.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ModulesComponent {
  modules: ModuleResponseDto[] = [];

  constructor(
    private usermanagerService: UsermanagerService,
    private dialog: MatDialog,
    private snackbar: SnackbarService
  ) {}

  getAllModules(): void {
    this.usermanagerService.getAllModules().subscribe({
      next: data => (this.modules = data),
      error: err => (this.snackbar.danger(err, 5000))
    });
  }

  openAddModuleDialog(): void {
    const dialogRef = this.dialog.open(ModuleDialogComponent, {
      panelClass: 'custom-dialog',
      width: '700px',
      maxWidth: '90vw'
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.getAllModules();
      }
    });
  }

  openEditModuleDialog(module: ModuleResponseDto): void {
    const dialogRef = this.dialog.open(ModuleDialogComponent, {
      panelClass: 'custom-dialog',
      width: '700px',
      maxWidth: '90vw',
      data: {
        module
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.getAllModules();
      }
    });
  }
}
