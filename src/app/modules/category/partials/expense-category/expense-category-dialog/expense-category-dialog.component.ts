import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from 'app/shared/material.module';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TitleCaseDirective } from 'app/directive/title-case.directive';
import { CategoryService } from '@services/category/category.service';
import { SnackbarService } from '@services/snackbar.service';
import { ExpenseCategoryResponseDto } from '@interfaces/category/expense-category/expense-category-response-dto';
import { ExpenseCategoryRequestDto } from '@interfaces/category/expense-category/expense-category-request-dto';
import { ExpenseCategoryModifyDto } from '@interfaces/category/expense-category/expense-category-modify-dto';
import { ConfirmDialogService } from '@services/confirm-dialog.service';

@Component({
  selector: 'app-expense-category-dialog',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MaterialModule, TitleCaseDirective],
  templateUrl: './expense-category-dialog.component.html',
  styleUrl: './expense-category-dialog.component.scss'
})
export class ExpenseCategoryDialogComponent {
  expenseCategoryForm!: FormGroup;
  isEditMode = false;

  constructor (
    private categoryService: CategoryService,
    private dialogRef: MatDialogRef<ExpenseCategoryDialogComponent>,
    private fb: FormBuilder,
    private snackbar: SnackbarService,
    private confirm: ConfirmDialogService,
    @Inject(MAT_DIALOG_DATA) public data: ExpenseCategoryResponseDto
  ) {
    this.isEditMode = !!data;

    this.expenseCategoryForm = this.fb.group({
      expenseCategoryId: [data?.expenseCategoryId || null],
      expenseCategoryName: [data?.expenseCategoryName || '', Validators.required],
      expenseCategoryDescription: [data?.expenseCategoryDescription || '', Validators.required],
      isActive: [data?.isActive ?? 1]
    });
  }

  addExpenseCategory(expenseCategory: ExpenseCategoryRequestDto): void {
    this.categoryService.addExpenseCategory(expenseCategory).subscribe({
      next: response => {
        this.snackbar.success(response.message);
        this.dialogRef.close(response.data);
      },
      error: err => (this.snackbar.danger(err, 4000))
    });
  }

  modifyExpenseCategory(expenseCategory: ExpenseCategoryModifyDto): void {
    this.categoryService.modifyExpenseCategory(expenseCategory).subscribe({
      next: response => {
        this.snackbar.success(response.message);
        this.dialogRef.close(response.data);
      },
      error: err => (this.snackbar.danger(err, 4000))
    });
  }

  onSubmit() {
    if(this.expenseCategoryForm.invalid) {
      this.expenseCategoryForm.markAllAsTouched();
      return;
    }

    this.confirm.openConfirm({
      title: `${this.isEditMode ? 'Update' : 'New' } Expense Category`,
      message: `Are you sure you want to ${this.isEditMode ? 'update' : 'save'} this expense category?`,
      confirmText: 'Yes',
      cancelText: 'No',
      icon: 'question'
    }).subscribe(result => {
      if(result) {
        if(this.isEditMode) {
          this.modifyExpenseCategory(this.expenseCategoryForm.value);
        }
        else {
          const { expenseCategoryName, expenseCategoryDescription, isActive } = this.expenseCategoryForm.value;
          const newExpenseCategory = { expenseCategoryName, expenseCategoryDescription, isActive };

          this.addExpenseCategory(newExpenseCategory);
        }
      }
    });
  }

  onCancel() {
    this.dialogRef.close();
  }

  get expenseCategoryControls() {
    return this.expenseCategoryForm.controls;
  }
}
