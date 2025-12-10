import { ChangeDetectorRef, Component, Inject, ViewEncapsulation } from '@angular/core';
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
import { ConfirmDialogService } from '@services/confirm-dialog.service';

@Component({
  selector: 'app-module-dialog',
  imports: [CommonModule, MaterialModule, FormsModule, ReactiveFormsModule, InputDirectivesModule],
  templateUrl: './module-dialog.component.html',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None
})
export class ModuleDialogComponent {
  moduleForm!: FormGroup;
  isEditMode = false;
  parentModules: ModuleResponseDto[] = [];

  constructor(
    private fb: FormBuilder,
    private usermanagerService: UsermanagerService,
    private snackbar: SnackbarService,
    private confirm: ConfirmDialogService,
    private cd: ChangeDetectorRef,
    public dialogRef: MatDialogRef<ModuleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ModuleResponseDto
  ) {
    this.isEditMode = !!data;

    this.moduleForm = this.fb.group({
      moduleId: [data?.moduleId || null],
      moduleName: [data?.moduleName || '', Validators.required],
      modulePage: [data?.modulePage || '', Validators.required],
      description: [data?.description || '', Validators.required],
      icon: [data?.icon || '', Validators.required],
      sortOrder: [data?.sortOrder, Validators.required],
      isActive: [data?.isActive ?? 1],
      parentId: [data?.parentId || null]
    });
  }

  ngOnInit() {
    setTimeout(() => {
      this.getAllParentModules();
    });
  }

  addModule(module: ModuleRequestDto): void {
    this.usermanagerService.addModule(module).subscribe({
      next: response => {
        this.snackbar.success(response.message);
        this.dialogRef.close(response.data);
      },
      error: error => {
        this.snackbar.danger(error, 4000);
      }
    });
  }

  modifyModule(module: ModuleModifyDto): void {
    this.usermanagerService.modifyModule(module).subscribe({
      next: response => {
        this.snackbar.success(response.message);
        this.dialogRef.close(response.data);
      },
      error: error => {
        this.snackbar.danger(error, 4000);
      }
    });
  }

  getAllParentModules(): void {
    this.usermanagerService.getAllParentModules().subscribe({
      next: response => (this.parentModules = response.data),
      error: err => (this.snackbar.danger(err, 4000))
    });
  }

  onSubmit() {
    if(this.moduleForm.invalid) {
      this.moduleForm.markAllAsTouched();
      return;
    }

    this.confirm.openConfirm({
      title: `${this.isEditMode ? 'Update' : 'Save'} Module`,
      message: `Are you sure you want to ${this.isEditMode ? 'update' : 'save'} this module?`,
      confirmText: 'Yes',
      cancelText: 'No',
      icon: 'question'
    }).subscribe(result => {
      if (result) {
        if(this.isEditMode) {
          this.modifyModule(this.moduleForm.value);
        }
        else{
          const { moduleName, description, modulePage, icon, sortOrder, isActive, parentId } = this.moduleForm.value;
          const newModule: ModuleRequestDto = { moduleName, description, modulePage, icon, sortOrder, isActive, parentId }

          this.addModule(newModule);
        }
      }
    });
  }
  onCancel() {
    this.dialogRef.close();
  }

  get moduleControl() {
    return this.moduleForm.controls;
  }
}
