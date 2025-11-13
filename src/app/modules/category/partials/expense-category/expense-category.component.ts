import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ExpenseCategoryResponseDto } from '@interfaces/category/expense-category/expense-category-response-dto';
import { CategoryService } from '@services/category/category.service';
import { SnackbarService } from '@services/snackbar.service';
import { ExpenseCategoryModifyDto } from '@interfaces/category/expense-category/expense-category-modify-dto';
import { ExpenseCategoryDialogComponent } from './expense-category-dialog/expense-category-dialog.component';

@Component({
  selector: 'app-expense-category',
  imports: [CommonModule, FormsModule],
  templateUrl: './expense-category.component.html',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None
})
export class ExpenseCategoryComponent {
  expenseCategory: ExpenseCategoryResponseDto[] = [];

  filteredData = [...this.expenseCategory]
  searchBar = '';

  constructor (
    private categoryService: CategoryService,
    private dialog: MatDialog,
    private snackbar: SnackbarService
  ) {}

  getAllExpenseCategories(): void {
    this.categoryService.getAllExpenseCategories().subscribe({
      next: response => {
        this.expenseCategory = response.data;
        this.filteredData = [...response.data];
      },
      error: err => (this.snackbar.danger(err, 4000))
    });
  }

  applyFilter(): void {
    const term = this.searchBar.toLowerCase().trim();
    
    this.filteredData = this.expenseCategory.filter(ec => 
      Object.values(ec).some(value =>
        value && value.toString().toLowerCase().includes(term)
      )
    );
  }

  openAddExpenseCategoryDialog() :void {
    const dialogRef = this.dialog.open(ExpenseCategoryDialogComponent, {
      panelClass: 'custom-dialog',
      width: '450px',
      maxWidth: '90vw'
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) this.getAllExpenseCategories();
    });
  }

  openModifyExpenseCategoryDialog(ec: ExpenseCategoryModifyDto): void {
    const dialogRef = this.dialog.open(ExpenseCategoryDialogComponent, {
      panelClass: 'custom-dialog',
      width: '450px',
      maxWidth: '90vw',
      data: ec
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) this.getAllExpenseCategories();
    });
  }
}
