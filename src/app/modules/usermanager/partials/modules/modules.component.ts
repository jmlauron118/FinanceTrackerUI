import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsermanagerService } from '@services/usermanager/usermanager.service';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarService } from '@services/snackbar.service';
import { ModuleResponseDto } from '@interfaces/usermanager/modules-dto/module-response-dto';
import { ModuleDialogComponent } from './module-dialog/module-dialog.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modules',
  imports: [CommonModule, FormsModule],
  templateUrl: './modules.component.html',
  styleUrls: ['./modules.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ModulesComponent {
  modules: ModuleResponseDto[] = [];

  filteredData = [...this.modules];
  searchBar = '';

  constructor(
    private usermanagerService: UsermanagerService,
    private dialog: MatDialog,
    private snackbar: SnackbarService
  ) {}

  getAllModules(): void {
    this.searchBar = '';
    this.usermanagerService.getAllModules().subscribe({
      next: response => {
        this.modules = response.data;
        this.filteredData = [...response.data];
      },
      error: err => (this.snackbar.danger(err, 5000))
    });
  }

  applyFilter(): void {
    const term = this.searchBar.toLowerCase().trim();

    this.filteredData = this.modules.filter(module => 
      Object.values(module).some(value => 
        value && value.toString().toLowerCase().includes(term)
      )
    );
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
      data: module
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.getAllModules();
      }
    });
  }
}
