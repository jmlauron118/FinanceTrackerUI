import { Component, ViewEncapsulation, Inject, PLATFORM_ID } from '@angular/core';
import { UsermanagerService } from '@services/usermanager/usermanager.service';
import { UserResponseDto } from '@interfaces/usermanager/users-dto/user-response-dto';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { UserDialogComponent } from './user-dialog/user-dialog.component';
import { SnackbarService } from '@services/snackbar.service';
import { MaterialModule } from "app/shared/material.module";
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-users',
  imports: [CommonModule, MaterialModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UsersComponent {
  users: UserResponseDto[] = [];
  
  filteredData = [...this.users];
  searchBar = '';

  constructor(
    private usermanagerService: UsermanagerService, 
    private dialog: MatDialog,
    private snackbar: SnackbarService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if(!isPlatformBrowser(this.platformId)) return;

    this.getAllUsers();
  }

  getAllUsers(): void {
    this.searchBar = '';
    this.usermanagerService.getAllUsers().subscribe({
      next: response => {
        this.users = response.data;
        this.filteredData = [...response.data];
      },
      error: (err) => {
        this.snackbar.danger(err, 5000);
      }
    });
  }

  applyFilter(): void {
    const term = this.searchBar.toLowerCase().trim();
    
    this.filteredData = this.users.filter(user => 
      Object.values(user).some(value => 
        value && value.toString().toLowerCase().includes(term)
      )
    );
  }

  openAddUserDialog(): void {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      panelClass: 'custom-dialog',
      width: '700px',
      maxWidth: '90vw'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getAllUsers();
      }
    });
  }

  openEditUserDialog(user: UserResponseDto): void {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      panelClass: 'custom-dialog',
      width: '700px',
      maxWidth: '90vw',
      data: user

    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.getAllUsers();
      }
    });
  }
}
