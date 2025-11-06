import { Component, Inject, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BudgetCategoryResponseDto } from '@interfaces/category/budget-category-dto/budget-category-response-dto';
import { CategoryService } from '@services/category/category.service';
import { SnackbarService } from '@services/snackbar.service';
import { MatDialog } from '@angular/material/dialog';
import { BudgetCategoryDialogComponent } from './budget-category-dialog/budget-category-dialog.component';

@Component({
  selector: 'app-budget-category',
  imports: [CommonModule, FormsModule],
  templateUrl: './budget-category.component.html',
  styleUrls: ['./budget-category.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BudgetCategoryComponent {
  budgetCategory: BudgetCategoryResponseDto[] = [];

  filteredData = [...this.budgetCategory];
  searchBar = '';

  constructor(
    private categoryService: CategoryService,
    private dialog: MatDialog,
    private snackbar: SnackbarService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if(!isPlatformBrowser(this.platformId)) return;

    this.getAllBudgetCategories();
  }

  getAllBudgetCategories(): void {
    this.categoryService.getAllBudgetCategories().subscribe({
      next: response => {
        this.budgetCategory = response.data;
        this.filteredData = [...response.data];
      },
      error: err => (this.snackbar.danger(err, 5000))
    });
  }

  applyFilter(): void {
    const term = this.searchBar.toLowerCase().trim();

    this.filteredData = this.budgetCategory.filter(bc =>
      Object.values(bc).some(value =>
        value && value.toString().toLowerCase().includes(term)
      )
    );
  }

  openAddBudgetCategoryDialog(): void {
    const dialogRef = this.dialog.open(BudgetCategoryDialogComponent, {
      panelClass: 'custom-dialog',
      width: '450px',
      maxWidth: '90vw'
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.getAllBudgetCategories();
      }
    });
  }

  openModifyBudgetCategoryDialog(budgetCategory: BudgetCategoryResponseDto): void {
    const dialogRef = this.dialog.open(BudgetCategoryDialogComponent, {
      panelClass: 'custom-dialog',
      width: '450px',
      maxWidth: '90vw',
      data: budgetCategory
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.getAllBudgetCategories();
      }
    });
  }
}
