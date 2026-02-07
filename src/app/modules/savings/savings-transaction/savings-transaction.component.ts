import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from 'app/shared/material.module';
import { SavingsTransactionResponseDto } from '@interfaces/savings/savings-transaction/savings-transaction-response-dto';
import { SavingsService } from '@services/savings/savings.service';
import { SnackbarService } from '@services/snackbar.service';

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
  filteredData = [...this.transactionData];
  searchBar = '';

  constructor(
    private savingsService: SavingsService,
    private snackbar: SnackbarService
  ){}

  ngOnInit(): void {
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

  applyFilter(): void {
    const term = this.searchBar.toLowerCase().trim();

    this.filteredData = this.transactionData.filter(st => 
      Object.values(st).some(value =>
        value && value.toString().toLowerCase().includes(term)
      )
    );
  }
}
