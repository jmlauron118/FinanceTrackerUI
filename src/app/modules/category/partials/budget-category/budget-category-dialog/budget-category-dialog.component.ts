import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormGroup, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from 'app/shared/material.module';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BudgetCategoryResponseDto } from '@interfaces/category/budget-category-dto/budget-category-response-dto';
import { TitleCaseDirective } from 'app/directive/title-case.directive';
import { BudgetCategoryRequestDto } from '@interfaces/category/budget-category-dto/budget-category-request-dto';
import { CategoryService } from '@services/category/category.service';
import { SnackbarService } from '@services/snackbar.service';
import { BudgetCategoryModifyDto } from '@interfaces/category/budget-category-dto/budget-category-modify-dto';
import { ConfirmDialogService } from '@services/confirm-dialog.service';

@Component({
  selector: 'app-budget-category-dialog',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MaterialModule, TitleCaseDirective],
  templateUrl: './budget-category-dialog.component.html',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None
})
export class BudgetCategoryDialogComponent {
  budgetCategoryForm!: FormGroup;
  isEditMode = false;

  constructor (
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<BudgetCategoryDialogComponent>,
    private categoryService: CategoryService,
    private snackbar: SnackbarService,
    private confirm: ConfirmDialogService,
    @Inject(MAT_DIALOG_DATA) public data: BudgetCategoryResponseDto
  ) {
    this.isEditMode = !!data;

    this.budgetCategoryForm = this.fb.group({
      budgetCategoryId: [data?.budgetCategoryId || null],
      budgetCategoryName: [data?.budgetCategoryName || '', Validators.required],
      budgetCategoryDescription: [data?.budgetCategoryDescription || '', Validators.required],
      isActive: [data?.isActive ?? 1]
    });
  }

  addBudgetCategory(budgetCategory: BudgetCategoryRequestDto): void {
    this.categoryService.addBudgetCategory(budgetCategory).subscribe({
      next: response => {
        this.snackbar.success(response.message);
        this.dialogRef.close(response.data);
      },
      error: err => (this.snackbar.danger(err, 4000))
    });
  }

  modifyBudgetCategory(budgetCategory: BudgetCategoryModifyDto): void {
    this.categoryService.modifyBudgetCategory(budgetCategory).subscribe({
      next: response => {
        this.snackbar.success(response.message);
        this.dialogRef.close(response.data);
      },
      error: err => (this.snackbar.danger(err, 4000))
    });
  }

  onSubmit() {
    if(this.budgetCategoryForm.invalid) {
      this.budgetCategoryForm.markAllAsTouched();
      return;
    }

    this.confirm.openConfirm({
      title: `${this.isEditMode ? 'Update': 'Save'} Budget Category`,
      message: `Are you sure you want to ${this.isEditMode ? 'update' : 'save'} this budget category?`,
      confirmText: 'Yes',
      cancelText: 'No',
      icon: 'question'
    }).subscribe(result => {
      if(result) {
        if(this.isEditMode) {
          this.modifyBudgetCategory(this.budgetCategoryForm.value);
        }
        else{
          const { budgetCategoryName, budgetCategoryDescription, isActive } = this.budgetCategoryForm.value;
          const newBudgetCategory: BudgetCategoryRequestDto = { budgetCategoryName, budgetCategoryDescription, isActive };

          this.addBudgetCategory(newBudgetCategory);
        }
      }
    });
  }

  onCancel() {
    this.dialogRef.close();
  }

  get budgetCategoryControls() {
    return this.budgetCategoryForm.controls;
  }
}
