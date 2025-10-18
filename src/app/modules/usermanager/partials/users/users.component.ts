import { Component, ViewEncapsulation } from '@angular/core';
import { UsermanagerService } from '@services/usermanager/usermanager.service';
import { UserResponseDTO } from '@interfaces/usermanager/users-dto/user-response-dto';
import { NgForOf, NgClass } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { UserDialogComponent } from './user-dialog/user-dialog.component';

@Component({
  selector: 'app-users',
  imports: [NgForOf, NgClass],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UsersComponent {
  users: UserResponseDTO[] = [];

  constructor(private usermanagerService: UsermanagerService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.getAllUsers();
  }

  getAllUsers(): void {
    this.usermanagerService.getAllUsers().subscribe({
      next: (data) => (this.users = data),
      error: (error) => console.error('Error fetching users:', error)
    });
  }

  openAddUserDialog(): void {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      panelClass: 'custom-dialog',
      width: '700px',
      maxWidth: '90vw',
      data: {
        isActive: 1
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.users.push(result);
      }
    });
  }
}
