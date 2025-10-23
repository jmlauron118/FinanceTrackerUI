import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormGroup, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModuleActionResponseDto } from '@interfaces/usermanager/module-actions-dto/module-action-response-dto';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialModule } from 'app/shared/material.module';
import { UsermanagerService } from '@services/usermanager/usermanager.service';
import { SnackbarService } from '@services/snackbar.service';
import { ModuleActionRequestDto } from '@interfaces/usermanager/module-actions-dto/module-action-request-dto';
import { ModuleActionModifyDto } from '@interfaces/usermanager/module-actions-dto/module-action-modify-dto';
import { ModuleResponseDto } from '@interfaces/usermanager/modules-dto/module-response-dto';
import { ActionResponseDto } from '@interfaces/usermanager/actions-dto/action-response-dto';

@Component({
  selector: 'app-module-action-dialog',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './module-action-dialog.component.html',
  styleUrl: './module-action-dialog.component.scss'
})
export class ModuleActionDialogComponent {
  moduleActionForm!: FormGroup;
  isEditMode = false;
  activeModules: ModuleResponseDto[] = [];
  activeActions: ActionResponseDto[] = [];

  constructor(
    private fb: FormBuilder,
    private usermanagerService: UsermanagerService,
    private snackbar: SnackbarService,
    public dialogRef: MatDialogRef<ModuleActionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { moduleAction?: ModuleActionResponseDto }
  ) {
    this.isEditMode = !!data;

    this.moduleActionForm = this.fb.group({
      moduleActionId: [data?.moduleAction?.moduleActionId || null],
      moduleId: [data?.moduleAction?.moduleId || null, Validators.required],
      actionId: [data?.moduleAction?.actionId || null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.getModuleList();
    this.getActionList();
  }

  addModuleAction(moduleAction: ModuleActionRequestDto): void {
    this.usermanagerService.addModuleAction(moduleAction).subscribe({
      next: data => {
        this.snackbar.success('Module action added successfully!');
        this.dialogRef.close(data);
      },
      error: err => (this.snackbar.danger(err, 5000))
    });
  }

  modifyModuleAction(moduleAction: ModuleActionModifyDto): void {
    this.usermanagerService.modifyModuleAction(moduleAction).subscribe({
      next: data => {
        this.snackbar.success('Module action modified successfully!');
        this.dialogRef.close(data);
      },
      error: err => (this.snackbar.danger(err, 5000))
    });
  }

  getModuleList(): void {
    this.usermanagerService.getAllModules(1).subscribe({
      next: data => (this.activeModules = data),
      error: err => (this.snackbar.danger(err, 5000))
    });
  }

  getActionList(): void {
    this.usermanagerService.getAllActions(1).subscribe({
      next: data => (this.activeActions = data),
      error: err => (this.snackbar.danger(err, 5000))
    });
  }

  onSubmit() {
    if(this.moduleActionForm.invalid) {
      this.moduleActionForm.markAllAsTouched();
      return;
    }

    if(this.isEditMode) {
      this.modifyModuleAction(this.moduleActionForm.value);
    }
    else{
      const { moduleId, actionId } = this.moduleActionForm.value;
      const newModuleAction: ModuleActionRequestDto = { moduleId, actionId };

      this.addModuleAction(newModuleAction);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  get moduleActionControls () {
    return this.moduleActionForm.controls;
  }
}
