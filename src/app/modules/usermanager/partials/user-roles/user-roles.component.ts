import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { UsermanagerService } from '@services/usermanager/usermanager.service';
import { UserRoleResponseDto } from '@interfaces/usermanager/user-roles-dto/user-role-response-dto';
import { SnackbarService } from '@services/snackbar.service';
import { UserRoleDialogComponent } from './user-role-dialog/user-role-dialog.component';
import { ConfirmDialogComponent } from 'app/shared/confirm-dialog/confirm-dialog.component';
import { title } from 'process';

@Component({
  selector: 'app-user-roles',
  imports: [CommonModule],
  templateUrl: './user-roles.component.html',
  styleUrls: ['./user-roles.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UserRolesComponent {
  userRoles: UserRoleResponseDto[] = [];

  constructor(
    private usermanagerService: UsermanagerService,
    private dialog: MatDialog,
    private snackbar: SnackbarService
  ) {}

  getAllUserRoles(): void {
    this.usermanagerService.getAllUserRoles().subscribe({
      next: data => (this.userRoles = data),
      error: err => (this.snackbar.danger(err, 5000))
    });
  }

  removeUserRole(id: number): void {
    this.usermanagerService.removeUserRole(id).subscribe({
      next: () => {
        this.snackbar.success('User role has been removed!')
        this.getAllUserRoles();
      },
      error: err => (this.snackbar.danger(err, 5000))
    });
  }

  openAddUserRoleDialog(): void {
    const dialogRef = this.dialog.open(UserRoleDialogComponent, {
      panelClass: 'custom-dialog',
      width: '400px',
      maxWidth: '90vw'
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.userRoles.push(result);
      }
    });
  }

  openEditUserRoleDialog(userRole: UserRoleResponseDto): void {
    const dialogRef = this.dialog.open(UserRoleDialogComponent, {
      panelClass: 'custom-dialog',
      width: '400px',
      maxWidth: '90vw',
      data: {
        userRole
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.getAllUserRoles();
      }
    });
  }

  confirmDelete(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      panelClass: 'custom-dialog',
      data: {
        title: 'Remove User Role',
        message: 'Are you sure you want to delete this user role?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.removeUserRole(id);
      }
    });
  }
}
