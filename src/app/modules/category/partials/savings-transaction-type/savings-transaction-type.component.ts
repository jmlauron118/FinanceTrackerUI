import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionTypeResponseDto } from '@interfaces/category/savings-transaction-type/transaction-type-response-dto';
import { CategoryService } from '@services/category/category.service';
import { SnackbarService } from '@services/snackbar.service';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TransactionTypeDialogComponent } from './transaction-type-dialog/transaction-type-dialog.component';
import { TransactionTypeModifyDto } from '@interfaces/category/savings-transaction-type/transaction-type-modify-dto';

@Component({
  selector: 'app-savings-transaction-type',
  imports: [CommonModule, FormsModule],
  templateUrl: './savings-transaction-type.component.html',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None
})
export class SavingsTransactionTypeComponent {
  transactionTypeData: TransactionTypeResponseDto[] = [];

  filteredData =  [...this.transactionTypeData];
  searchBar = '';

  constructor(
    private categoryService: CategoryService,
    private snackbar: SnackbarService,
    private dialog: MatDialog
  ) {}

  getAllSavingsTransactionTypes(): void {
    this.categoryService.getAllSavingsTransactionTypes().subscribe({
      next: response => {
        this.transactionTypeData = response.data;
        this.filteredData = [...response.data];
      },
      error: err => (this.snackbar.danger(err, 4000))
    });
  }

  applyFilter(): void {
    const term = this.searchBar.toLowerCase().trim();
    
    this.filteredData = this.transactionTypeData.filter(st => 
      Object.values(st).some(value =>
        value && value.toString().toLowerCase().includes(term)
      )
    );
  }

  openAddTransactionTypeDialog(): void {
    const dialogRef = this.dialog.open(TransactionTypeDialogComponent, {
      panelClass: 'custom-dialog',
      width: '600px',
      maxWidth: '90vw'
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) this.getAllSavingsTransactionTypes();
    });
  }

  openModifyTransactionTypeDialog(st: TransactionTypeModifyDto): void {
    const dialogRef = this.dialog.open(TransactionTypeDialogComponent, {
      panelClass: 'custom-dialog',
      width: '600px',
      maxWidth: '90vw',
      data: st
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) this.getAllSavingsTransactionTypes();
    });
  }
}
