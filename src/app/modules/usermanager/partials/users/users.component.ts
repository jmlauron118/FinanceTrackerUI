import { Component, ViewEncapsulation } from '@angular/core';
import { UsermanagerService } from '@services/usermanager/usermanager.service';
import { UserResponseDto } from '@interfaces/usermanager/users-dto/user-response-dto';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { UserDialogComponent } from './user-dialog/user-dialog.component';
import { SnackbarService } from '@services/snackbar.service';

@Component({
  selector: 'app-users',
  imports: [CommonModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UsersComponent {
  users: UserResponseDto[] = [];

  constructor(
    private usermanagerService: UsermanagerService, 
    private dialog: MatDialog,
    private snackbar: SnackbarService
  ) {}

  ngOnInit(): void {
    this.getAllUsers();
  }

  getAllUsers(): void {
    this.usermanagerService.getAllUsers().subscribe({
      next: (data) => (this.users = data),
      error: (err) => (this.snackbar.danger(err, 5000))
    });
  }

  openAddUserDialog(): void {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      panelClass: 'custom-dialog',
      width: '700px',
      maxWidth: '90vw'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.users.push(result);
      }
    });
  }

  openEditUserDialog(user: UserResponseDto): void {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      panelClass: 'custom-dialog',
      width: '700px',
      maxWidth: '90vw',
      data: {
        user
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.getAllUsers();
      }
    });
  }
}
