import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionResponseDto } from '@interfaces/usermanager/actions-dto/action-response-dto';
import { UsermanagerService } from '@services/usermanager/usermanager.service';
import { SnackbarService } from '@services/snackbar.service';
import { MatDialog } from '@angular/material/dialog';
import { ActionDialogComponent } from './action-dialog/action-dialog.component';
import { ActionModifyDto } from '@interfaces/usermanager/actions-dto/action-modify-dto';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-actions',
  imports: [CommonModule, FormsModule],
  templateUrl: './actions.component.html',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None
})
export class ActionsComponent {
  actions: ActionResponseDto[] = [];

  filteredData = [...this.actions];
  searchBar ='';

  constructor(
    private usermanagerService: UsermanagerService,
    private snackbar: SnackbarService,
    private dialog: MatDialog
  ) {}

  getAllActions(): void {
    this.searchBar ='';
    this.usermanagerService.getAllActions().subscribe({
      next: response => {
        this.actions = response.data;
        this.filteredData = [...response.data];
      },
      error: err => (this.snackbar.danger(err, 5000))
    });
  }

  applyFilter(): void {
    const term = this.searchBar.toLowerCase().trim();

    this.filteredData = this.actions.filter(action => 
      Object.values(action).some(value => 
        value && value.toString().toLowerCase().includes(term)
      )
    );
  }

  openAddActionDialog(): void {
    const dialogRef = this.dialog.open(ActionDialogComponent, {
      panelClass: 'custom-dialog',
      width: '400px',
      maxWidth: '90vw'
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.getAllActions();
      }
    });
  }

  openEditActionDialog(action: ActionModifyDto): void {
    const dialogRef = this.dialog.open(ActionDialogComponent, {
      panelClass: 'custom-dialog',
      width: '400px',
      maxWidth: '90vw',
      data: action
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.getAllActions();
      }
    });
  }
}
