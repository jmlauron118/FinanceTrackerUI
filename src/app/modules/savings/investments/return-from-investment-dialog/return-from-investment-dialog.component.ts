import { Component, ViewEncapsulation, Inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MaterialModule } from 'app/shared/material.module';
import { SavingsService } from '@services/savings/savings.service';
import { SnackbarService } from '@services/snackbar.service';
import { ConfirmDialogService } from '@services/confirm-dialog.service';
import { ReturnFromInvestmentDto } from '@interfaces/savings/investment/return-from-investment-dto';

@Component({
  selector: 'app-return-from-investment-dialog',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './return-from-investment-dialog.component.html',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None
})
export class ReturnFromInvestmentDialogComponent {
  returnFromInvestmentForm!: FormGroup;

  isViewMode = false;

  constructor(
    private savingsService: SavingsService,
    private datePipe: DatePipe,
    private snackbar: SnackbarService,
    private confirm: ConfirmDialogService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ReturnFromInvestmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ReturnFromInvestmentDto
  ) {
    console.log(data);
    this.isViewMode = !!data.amountReturned;

    this.returnFromInvestmentForm = this.fb.group({
      investmentId: [data?.investmentId || null],
      investmentDescription: [data?.investmentDescription || ''],
      returnDescription: [data?.returnDescription || '', Validators.required],
      amountInvested: [data?.amountInvested || null],
      amountReturned: [data?.amountReturned || '', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      realizedAmount: [data?.realizedAmount || null],
      dateReturned: [data?.dateReturned ? this.formatDate(data?.dateReturned) : '', Validators.required]
    });
  }

  returnFromInvestment(request: ReturnFromInvestmentDto): void {
    this.savingsService.returnFromInvestment(request).subscribe({
      next: response => {
        this.snackbar.success(response.message, 4000);
        this.dialogRef.close(true);
      },
      error: err => this.snackbar.danger(err, 4000),
    });
  }

  onSubmit(): void {
    if(this.returnFromInvestmentForm.invalid) {
      this.returnFromInvestmentForm.markAllAsTouched();
      return;
    }

    this.confirm.openConfirm({
      title: 'Return From Investment',
      message: `Are you sure you want to confirm this return from investment?`,
      confirmText: 'Yes',
      cancelText: 'No',
      icon: 'question'
    }).subscribe(result => {
      if (result) {
        this.returnFromInvestment(this.returnFromInvestmentForm.value);
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  get returnFromInvestmentControls() {
    return this.returnFromInvestmentForm.controls;
  }

  formatDate(date: any): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd') || '';
  }
}
