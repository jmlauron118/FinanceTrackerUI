import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvestmentTypeResponseDto } from '@interfaces/category/investment-type/investment-type-response-dto';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '@services/category/category.service';
import { SnackbarService } from '@services/snackbar.service';
import { MatDialog } from '@angular/material/dialog';
import { InvestmentTypeDialogComponent } from './investment-type-dialog/investment-type-dialog.component';

@Component({
  selector: 'app-investment-type',
  imports: [CommonModule, FormsModule],
  templateUrl: './investment-type.component.html',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None
})
export class InvestmentTypeComponent {
  investmentTypeData: InvestmentTypeResponseDto[] = [];

  filteredData = [...this.investmentTypeData];
  searchBar = '';

  constructor(
    private categoryService: CategoryService,
    private snackbar: SnackbarService,
    private dialog: MatDialog
  ){}

  getAllInvestmentTypes(): void {
    this.categoryService.getAllInvestmentTypes().subscribe({
      next: response => {
        this.investmentTypeData = response.data;
        this.filteredData = [...this.investmentTypeData];
      },
      error: err => (this.snackbar.danger(err, 4000))
    });
  }

  applyFilter(): void {
    const term = this.searchBar.toLowerCase().trim();
    
    this.filteredData = this.investmentTypeData.filter(st => 
      Object.values(st).some(value =>
        value && value.toString().toLowerCase().includes(term)
      )
    );
  }

  openAddInvestmentTypeDialog(): void {
    const dialogRef = this.dialog.open(InvestmentTypeDialogComponent, {
      panelClass: 'custom-dialog',
      width: '450px',
      maxWidth: '90vw'
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) this.getAllInvestmentTypes();
    });
  }

  openModifyInvestmentTypeDialog(it: InvestmentTypeResponseDto): void {
    const dialogRef = this.dialog.open(InvestmentTypeDialogComponent, {
      panelClass: 'custom-dialog',
      width: '450px',
      maxWidth: '90vw',
      data: it
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) this.getAllInvestmentTypes();
    });
  }
}
