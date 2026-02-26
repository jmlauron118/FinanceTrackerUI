import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from 'app/shared/material.module';
import { MatDialog } from '@angular/material/dialog';
import { SavingsTransactionResponseDto } from '@interfaces/savings/savings-transaction/savings-transaction-response-dto';
import { SavingsService } from '@services/savings/savings.service';
import { SnackbarService } from '@services/snackbar.service';
import { SavingsTransactionDialogComponent } from './savings-transaction-dialog/savings-transaction-dialog.component';
import { SavingsTransactionModifyDto } from '@interfaces/savings/savings-transaction/savings-transaction-modify-dto';
import { ConfirmDialogService } from '@services/confirm-dialog.service';
import { SavingsSummaryResponseDto } from '@interfaces/savings/savings-transaction/savings-summary-response-dto';

@Component({
  selector: 'app-savings-transaction',
  imports: [CommonModule, MaterialModule, FormsModule],
  templateUrl: './savings-transaction.component.html',
  styleUrls: ['./savings-transaction.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SavingsTransactionComponent {
  title = "Savings Transaction";
  transactionData: SavingsTransactionResponseDto[] = [];
  savingsSummaryData: SavingsSummaryResponseDto | null = null;
  filteredData = [...this.transactionData];
  searchBar = '';

  constructor(
    private savingsService: SavingsService,
    private confirm: ConfirmDialogService,
    private snackbar: SnackbarService,
    private dialog: MatDialog
  ){}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.getSavingsSummary();
    this.getAllSavingsTransaction();
  }

  getAllSavingsTransaction(): void {
    this.savingsService.getAllSavingsTransaction().subscribe({
      next: response => {
        this.transactionData = response.data;
        this.filteredData = [...this.transactionData];
      },
      error: err => (this.snackbar.danger(err, 4000))
    });
  }

  getSavingsSummary(): void {
    this.savingsService.getSavingsSummary().subscribe({
      next: response => (this.savingsSummaryData = response.data),
      error: err => (this.snackbar.danger(err, 4000))
    });
  }

  removeSavingsTransaction(id: number): void {
    this.confirm.openConfirm({
      title: 'Remove Savings Transaction',
      message: 'Are you sure you want to remove this transaction?',
      confirmText: 'Remove',
      cancelText: 'Cancel',
      icon: 'warning'
    }).subscribe(result => {
      if (result) {
        this.savingsService.removeSavingsTransaction(id).subscribe({
          next: response => {
            this.snackbar.success(response.message);
            this.loadData();
          },
          error: err => (this.snackbar.danger(err, 4000))
        });
      }
    });
  }

  applyFilter(): void {
    const term = this.searchBar.toLowerCase().trim();

    this.filteredData = this.transactionData.filter(st => 
      Object.values(st).some(value =>
        value && value.toString().toLowerCase().includes(term)
      )
    );
  }

  openAddSavingsTransaction(): void {
    const dialogRef = this.dialog.open(SavingsTransactionDialogComponent, {
      panelClass: 'custom-dialog',
      width: '520px',
      maxWidth: '90vw'
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) this.loadData();
    });
  }

  openModifySavingsTransaction(request: SavingsTransactionModifyDto): void {
    const dialogRef = this.dialog.open(SavingsTransactionDialogComponent, {
      panelClass: 'custom-dialog',
      width: '520px',
      maxWidth: '90vw',
      data: request
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) this.loadData();
    });

    if (request.transactionTypeId === 2) {
      dialogRef.componentInstance.savingsTransForm.get('investmentTypeId')?.enable();
      dialogRef.componentInstance.savingsTransForm.get('investmentTypeId')?.setValue(request.investmentTypeId);
    }
  }
}
