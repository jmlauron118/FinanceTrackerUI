import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormGroup, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialModule } from 'app/shared/material.module';
import { UsermanagerService } from '@services/usermanager/usermanager.service';
import { ModuleAccessResponseDto } from '@interfaces/usermanager/module-access-dto/module-access-response-dto';
import { ModuleAccessRequestDto } from '@interfaces/usermanager/module-access-dto/module-access-request-dto';
import { SnackbarService } from '@services/snackbar.service';
import { ModuleAccessModifyDto } from '@interfaces/usermanager/module-access-dto/module-access-modify-dto';
import { InputDirectivesModule } from "app/shared/input-directives.module";
import { ModuleActionResponseDto } from '@interfaces/usermanager/module-actions-dto/module-action-response-dto';
import { UserRoleResponseDto } from '@interfaces/usermanager/user-roles-dto/user-role-response-dto';
import { ConfirmDialogService } from '@services/confirm-dialog.service';

@Component({
  selector: 'app-module-access-dialog',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MaterialModule, InputDirectivesModule],
  templateUrl: './module-access-dialog.component.html',
  styleUrl: './module-access-dialog.component.scss'
})
export class ModuleAccessDialogComponent {
  moduleAccessForm!: FormGroup;
  isEditMode = false;
  moduleActionList: ModuleActionResponseDto[] = [];
  userRoleList: UserRoleResponseDto[] = [];

  constructor(
    private usermanagerService: UsermanagerService,
    private snackbar: SnackbarService,
    private confirm: ConfirmDialogService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ModuleAccessDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ModuleAccessResponseDto
  ) {
    this.isEditMode = !!data;

    this.moduleAccessForm = this.fb.group({
      moduleAccessId: [data?.moduleAccessId || null],
      moduleActionId: [data?.moduleActionId || null, Validators.required],
      userRoleId: [data?.userRoleId || null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.getModuleActionList();
    this.getUserRoleList();
  }

  addModuleAccess(moduleAccess: ModuleAccessRequestDto): void {
    this.usermanagerService.addModuleAccess(moduleAccess).subscribe({
      next: response => {
        this.snackbar.success(response.message);
        this.dialogRef.close(response.data);
      },
      error: err => (this.snackbar.danger(err, 5000))
    });
  }

  modifyModuleAccess(moduleAccess: ModuleAccessModifyDto): void {
    this.usermanagerService.modifyModuleAccess(moduleAccess).subscribe({
      next: response => {
        this.snackbar.success(response.message);
        this.dialogRef.close(response.data);
      },
      error: err => (this.snackbar.danger(err, 5000))
    })
  }

  getModuleActionList(): void {
    this.usermanagerService.getAllModuleActions().subscribe({
      next: response => (this.moduleActionList = response.data),
      error: err => (this.snackbar.danger(err, 5000))
    })
  }

  getUserRoleList(): void {
    this.usermanagerService.getAllUserRoles().subscribe({
      next: response => (this.userRoleList = response.data),
      error: err => (this.snackbar.danger(err, 5000))
    })
  }

  onSubmit() {
    if(this.moduleAccessForm.invalid) {
      this.moduleAccessForm.markAllAsTouched();
      return;
    }

    this.confirm.openConfirm({
      title: `${this.isEditMode ? 'Update' : 'Save'} Module Access`,
      message: `Are you sure you want to ${this.isEditMode ? 'update' : 'save'} this module access?`,
      confirmText: 'Yes',
      cancelText: 'No',
      icon: 'question'
    }).subscribe(result => {
      if(result) {
        if(this.isEditMode) {
          this.modifyModuleAccess(this.moduleAccessForm.value);
        }
        else {
          const { moduleActionId, userRoleId } = this.moduleAccessForm.value;
          const newModuleAccess: ModuleAccessRequestDto = { moduleActionId, userRoleId };

          this.addModuleAccess(newModuleAccess);
        }
      }
    });
  }

  onCancel() {
    this.dialogRef.close();
  }

  get moduleAccessControls() {
    return this.moduleAccessForm.controls;
  }
}
