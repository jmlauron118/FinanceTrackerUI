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
import { AutoTitleCaseDirective } from 'app/directive/auto-title-case.directive';

@Component({
  selector: 'app-role-dialog',
  imports: [CommonModule, FormsModule, MaterialModule, ReactiveFormsModule, AutoTitleCaseDirective],
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
    public dialogRef: MatDialogRef<RoleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { role?: RoleResponseDto }
  ) {
    this.isEditMode = !!data;

    this.roleForm = this.fb.group({
      roleId: [data?.role?.roleId || null],
      role: [data?.role?.role || '', Validators.required],
      description: [data?.role?.description || '', Validators.required],
      isActive: [data?.role?.isActive ?? 1]
    });
  }

  addRole(role: RoleRequestDto): void {
    this.usermanagerService.addRole(role).subscribe({
      next: data => {
        this.snackbar.success('Role added successfully!');
        this.dialogRef.close(data)
      },
      error: error => {
        this.snackbar.danger(error, 4000);
      }
    });
  }

  modifyRole(role: RoleModifyDto): void {
    this.usermanagerService.modifyRole(role).subscribe({
      next: data => {
        this.snackbar.success('Role modified successfully!');
        this.dialogRef.close(data)
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

    if(this.isEditMode){
      this.modifyRole(this.roleForm.value);
    }
    else {
      const { role, description, isActive } = this.roleForm.value;
      const newRole: RoleRequestDto = { role, description, isActive };

      this.addRole(newRole);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  get roleControl(){
    return this.roleForm.controls;
  }
}
