import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormGroup, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from 'app/shared/material.module';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CategoryService } from '@services/category/category.service';
import { SnackbarService } from '@services/snackbar.service';
import { TransactionTypeResponseDto } from '@interfaces/category/savings-transaction-type/transaction-type-response-dto';
import { TransactionTypeRequestDto } from '@interfaces/category/savings-transaction-type/transaction-type-request-dto';
import { TransactionTypeModifyDto } from '@interfaces/category/savings-transaction-type/transaction-type-modify-dto';
import { ConfirmDialogService } from '@services/confirm-dialog.service';
import { TitleCaseDirective } from 'app/directive/title-case.directive';

@Component({
  selector: 'app-transaction-type-dialog',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MaterialModule, TitleCaseDirective],
  templateUrl: './transaction-type-dialog.component.html',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None
})
export class TransactionTypeDialogComponent {
  transactionTypeForm!: FormGroup;
  isEditMode = false;

  constructor(
    private categoryService: CategoryService,
    private fb: FormBuilder,
    private snackbar: SnackbarService,
    private confirm: ConfirmDialogService,
    private dialogRef: MatDialogRef<TransactionTypeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TransactionTypeResponseDto
  ) {
    this.isEditMode = !!data;

    this.transactionTypeForm = this.fb.group({
      transactionTypeId: [data?.transactionTypeId || null],
      transactionTypeName: [data?.transactionTypeName || '', Validators.required],
      description: [data?.description || '', Validators.required],
      direction: [data?.direction ?? 1],
      isActive: [data?.isActive ?? 1]
    });
  }

  addTransactionType(transactionTypeRequest: TransactionTypeRequestDto): void {
    this.categoryService.addSavingsTransactionType(transactionTypeRequest).subscribe({
      next: response => {
        this.snackbar.success(response.message);
        this.dialogRef.close(response.data);
      },
      error: err => (this.snackbar.danger(err, 4000))
    });
  }

  modifyTransactionType(transactionTypeRequest: TransactionTypeModifyDto): void {
    this.categoryService.modifySavingsTransactionType(transactionTypeRequest).subscribe({
      next: response => {
        this.snackbar.success(response.message);
        this.dialogRef.close(response.data);
      },
      error: err => (this.snackbar.danger(err, 4000))
    });
  }

  onSubmit(): void {
    if(this.transactionTypeForm.invalid) {
      this.transactionTypeForm.markAllAsTouched();
      return;
    }

    this.confirm.openConfirm({
      title: `${this.isEditMode ? 'Update' : 'New' } Transaction Type`,
      message: `Are you sure you want to ${this.isEditMode ? 'update' : 'save'} this transaction type?`,
      confirmText: 'Yes',
      cancelText: 'No',
      icon: 'question'
    }).subscribe(result => {
      if (result) {
        if(this.isEditMode) {
          this.modifyTransactionType(this.transactionTypeForm.value);
        }
        else{
          const { transactionTypeName, description, direction, isActive } = this.transactionTypeForm.value;
          const newTransactionType = { transactionTypeName, description, direction, isActive };

          this.addTransactionType(newTransactionType);
        }
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  get transactionTypeControls() {
    return this.transactionTypeForm.controls;
  }
}
