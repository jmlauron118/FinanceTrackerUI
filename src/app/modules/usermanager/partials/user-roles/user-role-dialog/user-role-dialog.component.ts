import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormGroup, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialModule } from 'app/shared/material.module';
import { UserRoleResponseDto } from '@interfaces/usermanager/user-roles-dto/user-role-response-dto';
import { UsermanagerService } from '@services/usermanager/usermanager.service';
import { SnackbarService } from '@services/snackbar.service';
import { UserRoleRequestDto } from '@interfaces/usermanager/user-roles-dto/user-role-request-dto';
import { UserRoleModifyDto } from '@interfaces/usermanager/user-roles-dto/user-role-modify-dto';
import { UserResponseDto } from '@interfaces/usermanager/users-dto/user-response-dto';
import { RoleResponseDto } from '@interfaces/usermanager/roles-dto/role-response-dto';

@Component({
  selector: 'app-user-role-dialog',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './user-role-dialog.component.html',
  styleUrl: './user-role-dialog.component.scss'
})
export class UserRoleDialogComponent {
  userRoleForm!: FormGroup;
  isEditMode = false;
  activeUsers: UserResponseDto[] = [];
  activeRoles: RoleResponseDto[] = [];

  constructor(
    private usermanagerService: UsermanagerService,
    private snackbar: SnackbarService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<UserRoleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { userRole?: UserRoleResponseDto }
  ) {
    this.isEditMode = !!data;

    this.userRoleForm = this.fb.group({
      userRoleId: [data?.userRole?.userRoleId || null],
      userId: [data?.userRole?.userId || null, Validators.required],
      roleId: [data?.userRole?.roleId || null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.getUserList();
    this.getRoleList();
  }

  addUserRole(userRole: UserRoleRequestDto): void {
    this.usermanagerService.addUserRole(userRole).subscribe({
      next: data => {
        this.snackbar.success('User role added successfully!');
        this.dialogRef.close(data);
      },
      error: err => (this.snackbar.danger(err, 5000))
    });
  }

  modifyUserRole(userRole: UserRoleModifyDto): void {
    this.usermanagerService.modifyUserRole(userRole).subscribe({
      next: data => {
        this.snackbar.success('User role modified successfully!');
        this.dialogRef.close(data);
      },
      error: err => (this.snackbar.danger(err, 5000))
    });
  }

  getUserList(): void {
    this.usermanagerService.getAllUsers(1).subscribe({
      next: data => (this.activeUsers = data),
      error: err => (this.snackbar.danger(err, 5000))
    });
  }

  getRoleList(): void {
    this.usermanagerService.getAllRoles(1).subscribe({
      next: data => (this.activeRoles = data),
      error: err => (this.snackbar.danger(err, 5000))
    });
  }

  onSubmit() {
    if(this.userRoleForm.invalid) {
      this.userRoleForm.markAllAsTouched();
      return;
    }

    if(this.isEditMode) {
      this.modifyUserRole(this.userRoleForm.value);
    }
    else{
      const { userId, roleId } = this.userRoleForm.value;
      const newUserRole: UserRoleRequestDto = { userId, roleId };

      this.addUserRole(newUserRole);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  get userRoleControls() {
    return this.userRoleForm.controls;
  }
}
