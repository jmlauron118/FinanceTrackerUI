import { Component, ViewEncapsulation } from '@angular/core';
import { UsermanagerService } from '@services/usermanager/usermanager.service';
import { MatDialog } from '@angular/material/dialog';
import { RoleResponseDto } from '@interfaces/usermanager/roles-dto/role-response-dto';
import { CommonModule } from '@angular/common';
import { SnackbarService } from '@services/snackbar.service';
import { RoleDialogComponent } from './role-dialog/role-dialog.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-roles',
  imports: [CommonModule, FormsModule],
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RolesComponent {
  roles: RoleResponseDto[] = [];

  filteredData = [...this.roles];
  searchBar = '';

  constructor(
    private usermanagerService: UsermanagerService,
    private dialog: MatDialog,
    private snackbar: SnackbarService
  ) {}

  getAllRoles(): void {
    this.searchBar = '';
    this.usermanagerService.getAllRoles().subscribe({
      next: (data) => {
        this.roles = data;
        this.filteredData = [...data];
      },
      error: (err) => (this.snackbar.danger(err, 5000))
    });
  }

  applyFilter(): void {
    const term = this.searchBar.toLowerCase().trim();

    this.filteredData = this.roles.filter(role => 
      Object.values(role).some(value => 
        value && value.toString().toLowerCase().includes(term)
      )
    );
  }

  openAddRoleDialog(): void {
    const dialogRef = this.dialog.open(RoleDialogComponent, {
      panelClass: 'custom-dialog',
      width: '400px',
      maxWidth: '90vw'
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.getAllRoles();
      }
    });
  }

  openModifyRoleDialog(role: RoleResponseDto): void {
    const dialogRef = this.dialog.open(RoleDialogComponent, {
      panelClass: 'custom-dialog',
      width: '400px',
      maxWidth: '90vw',
      data: {
        role
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.getAllRoles();
      }
    });
  }
}
