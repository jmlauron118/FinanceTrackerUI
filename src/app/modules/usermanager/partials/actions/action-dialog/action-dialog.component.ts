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
    public dialogRef: MatDialogRef<ActionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { action?: ActionResponseDto }
  ) {
    this.isEditMode = !!data;

    this.actionForm = this.fb.group({
      actionId: [data?.action?.actionId || 0],
      actionName: [data?.action?.actionName || '', Validators.required],
      description: [data?.action?.description || '', Validators.required],
      isActive: [data?.action?.isActive ?? 1, Validators.required]
    });
  }

  addAction(action: ActionRequestDto): void {
    this.usermanagerService.addAction(action).subscribe({
      next: data => {
        this.snackbar.success('Action added successfully!');
        this.dialogRef.close(data);
      },
      error: err => (this.snackbar.danger(err, 5000))
    });
  }

  modifyAction(action: ActionModifyDto): void {
    this.usermanagerService.modifyAction(action).subscribe({
      next: data => {
        this.snackbar.success('Action modified successfully!');
        this.dialogRef.close(data);
      },
      error: err => (this.snackbar.danger(err, 5000))
    });
  }

  onSubmit() {
    if(this.actionForm.invalid) {
      this.actionForm.markAllAsTouched();
      return;
    }

    if(this.isEditMode){
      this.modifyAction(this.actionForm.value);
    }
    else{
      const { actionName, description, isActive } = this.actionForm.value;
      const newAction: ActionRequestDto = { actionName, description, isActive };

      this.addAction(newAction);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  get actionControls() {
    return this.actionForm.controls;
  }
}
