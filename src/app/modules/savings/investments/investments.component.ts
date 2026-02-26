import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from 'app/shared/material.module';
import { MatDialog } from '@angular/material/dialog';
import { InvestmentResponseDto } from '@interfaces/savings/investment/investment-response-dto';
import { SavingsService } from '@services/savings/savings.service';
import { SnackbarService } from '@services/snackbar.service';
import { ReturnFromInvestmentDialogComponent } from './return-from-investment-dialog/return-from-investment-dialog.component';
import { ReturnFromInvestmentDto } from '@interfaces/savings/investment/return-from-investment-dto';

@Component({
  selector: 'app-investments',
  imports: [CommonModule, FormsModule, MaterialModule],
  templateUrl: './investments.component.html',
  styleUrls: ['./investments.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class InvestmentsComponent {
  title = 'Investments';
  investmentData: InvestmentResponseDto[] = [];
  filteredData = [...this.investmentData];
  searchBar = '';

  constructor(
    private savingsService: SavingsService,
    private snackbar: SnackbarService,
    private dialog: MatDialog
  ){}

  ngOnInit() {
    this.getAllInvestments();
  }

  getAllInvestments(): void {
    this.savingsService.getAllInvestments().subscribe({
      next: response => {
        this.investmentData = response.data;
        this.filteredData = [...this.investmentData];
      },
      error: err => (this.snackbar.danger(err, 4000))
    });
  }

  applyFilter(): void {
    const term = this.searchBar.toLowerCase().trim();

    this.filteredData = this.investmentData.filter(i => 
      Object.values(i).some(value =>
        value && value.toString().toLowerCase().includes(term)
      )
    );
  }

  openReturnFromInvestment(investmentData: InvestmentResponseDto): void {
    const dialogRef = this.dialog.open(ReturnFromInvestmentDialogComponent, {
      panelClass: 'custom-dialog',
      width: '400px',
      maxWidth: '90vw',
      data: {
        investmentId: investmentData.investmentId,
        amountInvested: investmentData.investmentAmount,
        investmentDescription: investmentData.description
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.getAllInvestments();
      }
    });
  }

  openViewReturnFromInvestment(investmentData: InvestmentResponseDto): void {
    this.savingsService.getReturnSavingsInvestment(investmentData.returnTransactionId ?? 0).subscribe({
      next: response => {
        const returnData = response.data;
        const dialogRef = this.dialog.open(ReturnFromInvestmentDialogComponent, {
          panelClass: 'custom-dialog',
          width: '400px',
          maxWidth: '90vw',
          data: {
            investmentId: investmentData.investmentId,
            investmentDescription: investmentData.description,
            returnDescription: returnData.description,
            amountInvested: investmentData.investmentAmount,
            amountReturned: returnData.amount,
            realizedAmount: investmentData.realizedAmount,
            dateReturned: returnData.dateUsed
          }
        });

        dialogRef.afterClosed().subscribe(result => {
          if(result) {
            this.getAllInvestments();
          }
        });
      },
      error: err => this.snackbar.danger(err, 4000)
    });
  }

  getGainLossPercentage(investmentAmount: number, realizedAmount: number): number {
    return (realizedAmount/investmentAmount) * 100;
  }
}
