import { Component, ViewEncapsulation, Inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MaterialModule } from 'app/shared/material.module';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DecimalDirective } from 'app/directive/decimal.directive';
import { TransactionTypeResponseDto } from '@interfaces/category/savings-transaction-type/transaction-type-response-dto';
import { InvestmentTypeResponseDto } from '@interfaces/category/investment-type/investment-type-response-dto';
import { ConfirmDialogService } from '@services/confirm-dialog.service';
import { SnackbarService } from '@services/snackbar.service';
import { SavingsTransactionResponseDto } from '@interfaces/savings/savings-transaction/savings-transaction-response-dto';
import { CategoryService } from '@services/category/category.service';
import { SavingsTransactionRequestDto } from '@interfaces/savings/savings-transaction/savings-transaction-request-dto';
import { SavingsService } from '@services/savings/savings.service';
import { SavingsTransactionModifyDto } from '@interfaces/savings/savings-transaction/savings-transaction-modify-dto';

@Component({
  selector: 'app-savings-transaction-dialog',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MaterialModule, DecimalDirective],
  templateUrl: './savings-transaction-dialog.component.html',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None
})
export class SavingsTransactionDialogComponent {
  savingsTransForm!: FormGroup;

  transactionTypeData: TransactionTypeResponseDto[] = [];
  investmentTypeData: InvestmentTypeResponseDto[] = [];
  isEditMode = false;
  investmentTypeEnabled = true;

  constructor(
    private categoryService: CategoryService,
    private savingsService: SavingsService,
    private datePipe: DatePipe,
    private fb: FormBuilder,
    private confirm: ConfirmDialogService,
    private snackbar: SnackbarService,
    private dialogRef: MatDialogRef<SavingsTransactionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SavingsTransactionResponseDto
  ){
    this.isEditMode = !!data;

    this.savingsTransForm = this.fb.group({
      transactionId: [data?.transactionId || null],
      transactionTypeId: [data?.transactionTypeId || null, Validators.required],
      investmentTypeId: [{value: '', disabled: true}, !this.investmentTypeEnabled ? []: [Validators.required]],
      description: [data?.description || '', Validators.required],
      amount: [data?.amount || '', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      status: [data?.status ?? 0],
      dateUsed: [data?.dateUsed ? this.formatDate(data?.dateUsed) : '', Validators.required]
    });
  }

  ngOnInit() {
    setTimeout(() => {
      this.loadSavingsTransactionType();
      this.loadInvestmentType();
    });
  }

  loadSavingsTransactionType(): void {
    this.categoryService.getAllSavingsTransactionTypes(1, 2).subscribe({
      next: response => (this.transactionTypeData = response.data),
      error: err => (this.snackbar.danger(err, 4000))
    });
  }

  loadInvestmentType(): void {
    this.categoryService.getAllInvestmentTypes(1).subscribe({
      next: response => (this.investmentTypeData = response.data),
      error: err => (this.snackbar.danger(err, 4000))
    });
  }

  addSavingsTransaction(request: SavingsTransactionRequestDto): void {
    this.savingsService.addSavingsTransaction(request).subscribe({
      next: response => {
        this.snackbar.success(response.message);
        this.dialogRef.close(true);
      },
      error: err => (this.snackbar.danger(err, 4000))
    });
  }

  modifySavingsTransaction(request: SavingsTransactionModifyDto): void {
    this.savingsService.modifySavingsTransaction(request).subscribe({
      next: response => {
        this.snackbar.success(response.message);
        this.dialogRef.close(true);
      },
      error: err => (this.snackbar.danger(err, 4000))
    });
  }

  onSubmit(): void {
    if(this.savingsTransForm.invalid) {
      this.savingsTransForm.markAllAsTouched();
      return;
    }
    
    const formData = this.savingsTransForm.value;
    const data = {
      ...formData,
      dateUsed: this.formatDate(formData.dateUsed)
    }

    this.confirm.openConfirm({
      title: `${this.isEditMode ? 'Update' : 'Save'} Savings Transaction Entry`,
      message: `Are you sure you want to ${this.isEditMode ? 'update' : 'save'} this transaction entry?`,
      confirmText: this.isEditMode ? 'Update' : 'Save',
      cancelText: 'Cancel',
      icon: 'question'
    }).subscribe(result => {
      if (result) {
        if(this.isEditMode) {
          this.modifySavingsTransaction(data);
        }
        else {
          const { transactionTypeId, investmentTypeId, description, amount, status, dateUsed } = data;
          const newEntry: SavingsTransactionRequestDto = { transactionTypeId, investmentTypeId, description, amount, status, dateUsed };
          this.addSavingsTransaction(newEntry);
        }
      }
    });
}

  onCancel(): void {
    this.dialogRef.close();
  }

  onTransactionTypeChange(value: number): void {
    const selected = this.transactionTypeData.find(
      tt => tt.transactionTypeId === value
    );

    if (selected?.transactionTypeId === 2) {
      this.investmentTypeEnabled = false;
      this.savingsTransForm.get('investmentTypeId')?.enable();
    }
    else{
      this.investmentTypeEnabled = true;
      this.savingsTransForm.get('investmentTypeId')?.disable();
      this.savingsTransForm.get('investmentTypeId')?.setValue('');
    }
  }

  get transactionControl() {
    return this.savingsTransForm.controls;
  }

  formatDate(date: any): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd') || '';
  }
}
