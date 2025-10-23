import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'app/shared/material.module';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule, FormGroup, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsermanagerService } from '@services/usermanager/usermanager.service';
import { SnackbarService } from '@services/snackbar.service';
import { ModuleResponseDto } from '@interfaces/usermanager/modules-dto/module-response-dto';
import { ModuleRequestDto } from '@interfaces/usermanager/modules-dto/module-request-dto';
import { ModuleModifyDto } from '@interfaces/usermanager/modules-dto/module-modify-dto';
import { InputDirectivesModule } from 'app/shared/input-directives.module';

@Component({
  selector: 'app-module-dialog',
  imports: [CommonModule, MaterialModule, FormsModule, ReactiveFormsModule, InputDirectivesModule],
  templateUrl: './module-dialog.component.html',
  styleUrls: ['./module-dialog.component.scss']
})
export class ModuleDialogComponent {
  moduleForm!: FormGroup;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private usermanagerService: UsermanagerService,
    private snackbar: SnackbarService,
    public dialogRef: MatDialogRef<ModuleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { module?: ModuleResponseDto }
  ) {
    this.isEditMode = !!data;

    this.moduleForm = this.fb.group({
      moduleId: [data?.module?.moduleId || null],
      moduleName: [data?.module?.moduleName || '', Validators.required],
      modulePage: [data?.module?.modulePage || '', Validators.required],
      description: [data?.module?.description || '', Validators.required],
      icon: [data?.module?.icon || '', Validators.required],
      sortOrder: [data?.module?.sortOrder, Validators.required],
      isActive: [data?.module?.isActive ?? 1]
    });
  }

  addModule(module: ModuleRequestDto): void {
    this.usermanagerService.addModule(module).subscribe({
      next: data => {
        this.snackbar.success('Module added successfully!');
        this.dialogRef.close(data);
      },
      error: error => {
        this.snackbar.danger(error, 4000);
      }
    });
  }

  modifyModule(module: ModuleModifyDto): void {
    this.usermanagerService.modifyModule(module).subscribe({
      next: data => {
        this.snackbar.success('Module modified successfully!');
        this.dialogRef.close(data);
      },
      error: error => {
        this.snackbar.danger(error, 4000);
      }
    });
  }

  onSubmit() {
    if(this.moduleForm.invalid) {
      this.moduleForm.markAllAsTouched();
      return;
    }

    if(this.isEditMode) {
      this.modifyModule(this.moduleForm.value);
    }
    else{
      const { moduleName, description, modulePage, icon, sortOrder, isActive } = this.moduleForm.value;
      const newModule: ModuleRequestDto = { moduleName, description, modulePage, icon, sortOrder, isActive }

      this.addModule(newModule);
    }
  }
  onCancel() {
    this.dialogRef.close();
  }

  get moduleControl() {
    return this.moduleForm.controls;
  }
}
