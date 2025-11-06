import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RoleResponseDto } from '@interfaces/usermanager/roles-dto/role-response-dto';
import { FormsModule, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from 'app/shared/material.module';
import { UsermanagerService } from '@services/usermanager/usermanager.service';
import { SnackbarService } from '@services/snackbar.service';
import { RoleRequestDto } from '@interfaces/usermanager/roles-dto/role-request-dto';
import { RoleModifyDto } from '@interfaces/usermanager/roles-dto/role-modify-dto';
import { InputDirectivesModule } from 'app/shared/input-directives.module';
import { ConfirmDialogService } from '@services/confirm-dialog.service';

@Component({
  selector: 'app-role-dialog',
  imports: [CommonModule, FormsModule, MaterialModule, ReactiveFormsModule, InputDirectivesModule],
  templateUrl: './role-dialog.component.html',
  styleUrls: ['./role-dialog.component.scss']
})
export class RoleDialogComponent {
  roleForm!: FormGroup;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private usermanagerService: UsermanagerService,
    private snackbar: SnackbarService,
    private confirm: ConfirmDialogService,
    public dialogRef: MatDialogRef<RoleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RoleResponseDto
  ) {
    this.isEditMode = !!data;

    this.roleForm = this.fb.group({
      roleId: [data?.roleId || null],
      role: [data?.role || '', Validators.required],
      description: [data?.description || '', Validators.required],
      isActive: [data?.isActive ?? 1]
    });
  }

  addRole(role: RoleRequestDto): void {
    this.usermanagerService.addRole(role).subscribe({
      next: response => {
        this.snackbar.success(response.message);
        this.dialogRef.close(response.data)
      },
      error: error => {
        this.snackbar.danger(error, 5000);
      }
    });
  }

  modifyRole(role: RoleModifyDto): void {
    this.usermanagerService.modifyRole(role).subscribe({
      next: response => {
        this.snackbar.success(response.message);
        this.dialogRef.close(response.data)
      },
      error: error => {
        this.snackbar.danger(error, 4000);
      }
    });
  }

  onSubmit() {
    if(this.roleForm.invalid) {
      this.roleForm.markAllAsTouched();
      return;
    }

    this.confirm.openConfirm({
      title: `${this.isEditMode ? 'Update' : 'Save'} Role`,
      message: `Are you sure you want to ${this.isEditMode ? 'update' : 'save'} this role?`,
      confirmText: 'Yes',
      cancelText: 'No',
      icon: 'question'
    }).subscribe(result => {
      if (result) {
        if(this.isEditMode){
          this.modifyRole(this.roleForm.value);
        }
        else {
          const { role, description, isActive } = this.roleForm.value;
          const newRole: RoleRequestDto = { role, description, isActive };

          this.addRole(newRole);
        }
      }
    });
  }

  onCancel() {
    this.dialogRef.close();
  }

  get roleControl(){
    return this.roleForm.controls;
  }
}
