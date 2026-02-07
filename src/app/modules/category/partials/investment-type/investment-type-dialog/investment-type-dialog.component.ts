import { Component, ViewEncapsulation, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from 'app/shared/material.module';
import { TitleCaseDirective } from 'app/directive/title-case.directive';
import { CategoryService } from '@services/category/category.service';
import { SnackbarService } from '@services/snackbar.service';
import { ConfirmDialogService } from '@services/confirm-dialog.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InvestmentTypeResponseDto } from '@interfaces/category/investment-type/investment-type-response-dto';
import { InvestmentTypeRequestDto } from '@interfaces/category/investment-type/investment-type-request-dto';
import { InvestmentTypeModifyDto } from '@interfaces/category/investment-type/investment-type-modify-dto';

@Component({
  selector: 'app-investment-type-dialog',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MaterialModule, TitleCaseDirective],
  templateUrl: './investment-type-dialog.component.html',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None
})
export class InvestmentTypeDialogComponent {
  investmentTypeForm!: FormGroup;
  isEditMode = false;

  constructor(
    private categoryService: CategoryService,
    private fb: FormBuilder,
    private snackbar: SnackbarService,
    private confirm: ConfirmDialogService,
    private dialogRef: MatDialogRef<InvestmentTypeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: InvestmentTypeResponseDto
  ) {
    this.isEditMode = !!data;
    this.investmentTypeForm = this.fb.group({
      investmentTypeId: [data?.investmentTypeId || null],
      investmentTypeName: [data?.investmentTypeName || '', Validators.required],
      description: [data?.description || '', Validators.required],
      isActive: [data?.isActive ?? 1]
    });
  }

  addInvestmentType(investmentTypeRequest: InvestmentTypeRequestDto): void {
    this.categoryService.addInvestmentType(investmentTypeRequest).subscribe({
      next: response => {
        this.snackbar.success(response.message);
        this.dialogRef.close(response.data);
      },
      error: err => (this.snackbar.danger(err, 4000))
    });
  }

  modifyInvestmentType(investmentTypeRequest: InvestmentTypeModifyDto): void {
    this.categoryService.modifyInvestmentType(investmentTypeRequest).subscribe({
      next: response => {
        this.snackbar.success(response.message);
        this.dialogRef.close(response.data);
      },
      error: err => (this.snackbar.danger(err, 4000))
    });
  }

  onSubmit(): void {
    if(this.investmentTypeForm.invalid) {
      this.investmentTypeForm.markAllAsTouched();
      return;
    }

    this.confirm.openConfirm({
      title: `${this.isEditMode ? 'Update' : 'New' } Investment Type`,
      message: `Are you sure you want to ${this.isEditMode ? 'update' : 'save'} this investment type?`,
      confirmText: 'Yes',
      cancelText: 'No',
      icon: 'question'
    }).subscribe(result => {
      if(result) {
        if(this.isEditMode) {
          this.modifyInvestmentType(this.investmentTypeForm.value);
        }
        else {
          const { investmentTypeName, description, isActive } = this.investmentTypeForm.value;
          const newInvestmentType = { investmentTypeName, description, isActive }

          this.addInvestmentType(newInvestmentType);
        }
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  get investmentTypeControls() {
    return this.investmentTypeForm.controls;
  }
}
