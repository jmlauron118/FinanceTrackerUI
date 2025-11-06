import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialModule } from 'app/shared/material.module';
import { FormsModule, FormGroup, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActionResponseDto } from '@interfaces/usermanager/actions-dto/action-response-dto';
import { SnackbarService } from '@services/snackbar.service';
import { UsermanagerService } from '@services/usermanager/usermanager.service';
import { ActionRequestDto } from '@interfaces/usermanager/actions-dto/action-request-dto';
import { ActionModifyDto } from '@interfaces/usermanager/actions-dto/action-modify-dto';
import { UpperCaseDirective } from 'app/directive/uppercase.directive';
import { ConfirmDialogService } from '@services/confirm-dialog.service';

@Component({
  selector: 'app-action-dialog',
  imports: [CommonModule, MaterialModule, FormsModule, ReactiveFormsModule, UpperCaseDirective],
  templateUrl: './action-dialog.component.html',
  styleUrls: ['./action-dialog.component.scss']
})
export class ActionDialogComponent {
  actionForm!: FormGroup;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private usermanagerService: UsermanagerService,
    private snackbar: SnackbarService,
    private confirm: ConfirmDialogService,
    public dialogRef: MatDialogRef<ActionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ActionResponseDto
  ) {
    this.isEditMode = !!data;

    this.actionForm = this.fb.group({
      actionId: [data?.actionId || 0],
      actionName: [data?.actionName || '', Validators.required],
      description: [data?.description || '', Validators.required],
      isActive: [data?.isActive ?? 1, Validators.required]
    });
  }

  addAction(action: ActionRequestDto): void {
    this.usermanagerService.addAction(action).subscribe({
      next: response => {
        this.snackbar.success(response.message);
        this.dialogRef.close(response.data);
      },
      error: err => (this.snackbar.danger(err, 5000))
    });
  }

  modifyAction(action: ActionModifyDto): void {
    this.usermanagerService.modifyAction(action).subscribe({
      next: response => {
        this.snackbar.success(response.message);
        this.dialogRef.close(response.data);
      },
      error: err => (this.snackbar.danger(err, 5000))
    });
  }

  onSubmit() {
    if(this.actionForm.invalid) {
      this.actionForm.markAllAsTouched();
      return;
    }

    this.confirm.openConfirm({
      title: `${this.isEditMode ? 'Update' : 'Save'} Action`,
      message: `Are you sure you want to ${this.isEditMode ? 'update' : 'save'} this action?`,
      confirmText: 'Yes',
      cancelText: 'No',
      icon: 'question'
    }).subscribe(result => {
      if(result){
        if(this.isEditMode){
          this.modifyAction(this.actionForm.value);
        }
        else{
          const { actionName, description, isActive } = this.actionForm.value;
          const newAction: ActionRequestDto = { actionName, description, isActive };

          this.addAction(newAction);
        }
      }
    });
  }

  onCancel() {
    this.dialogRef.close();
  }

  get actionControls() {
    return this.actionForm.controls;
  }
}
