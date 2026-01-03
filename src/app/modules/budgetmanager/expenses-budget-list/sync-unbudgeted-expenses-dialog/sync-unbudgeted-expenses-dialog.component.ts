import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from 'app/shared/material.module';
import { MatDialogRef } from '@angular/material/dialog';
import { CategoryService } from '@services/category/category.service';
import { BudgetCategoryResponseDto } from '@interfaces/category/budget-category-dto/budget-category-response-dto';
import { SnackbarService } from '@services/snackbar.service';
import { ExpenseCategoryResponseDto } from '@interfaces/category/expense-category/expense-category-response-dto';
import { LoadingService } from '@services/loading.service';
import { BudgetmanagerService } from '@services/budgetmanager/budgetmanager.service';
import { ExpensesBudgetResponseDto } from '@interfaces/budgetmanager/expenses-budget/expenses-budget-response-dto';
import { BudgetEntryResponseDto } from '@interfaces/budgetmanager/budget-entry/budget-entry-response-dto';
import { BudgetEntryRequestDto } from '@interfaces/budgetmanager/budget-entry/budget-entry-request-dto';
import { ConfirmDialogService } from '@services/confirm-dialog.service';

@Component({
  selector: 'app-sync-budgeted-expenses-dialog',
  imports: [CommonModule, MaterialModule, FormsModule],
  templateUrl: './sync-unbudgeted-expenses-dialog.component.html',
  styleUrls: ['./sync-unbudgeted-expenses-dialog.component.scss'], 
  encapsulation: ViewEncapsulation.None,
})
export class SyncUnbudgetedExpensesDialogComponent {
  budgetCategoryData: BudgetCategoryResponseDto[] = [];
  expenseCategoryData: ExpenseCategoryResponseDto[] = [];
  unbudgetedExpensesData: BudgetEntryResponseDto[] = [];
  dateUsed: Date | null = null;

  constructor(
    private budgetManagerService: BudgetmanagerService,
    private categoryService: CategoryService,
    private snackbar: SnackbarService,
    private loading: LoadingService,
    private confirm: ConfirmDialogService,
    private datePipe: DatePipe,
    private dialogRef: MatDialogRef<SyncUnbudgetedExpensesDialogComponent>
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.loadBudgetCategory();
      this.loadExpenseCategory();
      this.getUnbudgetedExpenses();
    });
  }

  onCancel() : void {
    this.dialogRef.close({ status: false });
  }

  loadBudgetCategory(): void {
    this.categoryService.getAllBudgetCategories(1).subscribe({
      next: response => (this.budgetCategoryData = response.data),
      error: err => (this.snackbar.danger(err, 5000))
    });
  }

  loadExpenseCategory(): void {
    this.categoryService.getAllExpenseCategories(1).subscribe({
      next: response => (this.expenseCategoryData = response.data),
      error: err => (this.snackbar.danger(err, 5000))
    });
  }

  getUnbudgetedExpenses(): void {
    this.loading.show();
    this.budgetManagerService.getExpensesBudgetByCategory(3).subscribe({
      next: response => (this.unbudgetedExpensesData = this.mapBudgetEntries(response.data)),
      error: err => {
        this.snackbar.danger(err, 5000);
        this.loading.hide();
      },
      complete: () => this.loading.hide()
    });
  }

  syncBudgetEntries(budgetRequest: BudgetEntryRequestDto[]): void {
    this.loading.show();
    this.budgetManagerService.syncBudgetEntries(budgetRequest).subscribe({
      next: response => {
        this.dialogRef.close({ status: true });
        this.snackbar.success(response.message)
      },
      error: err => {
        this.loading.hide();
        this.snackbar.danger(err, 5000);
      },
      complete: () => (this.loading.hide())
    });
  }

  toBudgetEntryData(entry: ExpensesBudgetResponseDto): BudgetEntryResponseDto {
    return {
      budgetEntryId: 0,
      budgetCategoryId: 0,
      budgetCategoryName: '',
      expenseCategoryId: 0,
      expenseCategoryName: '',
      description: entry.description,
      amount: entry.amount,
      dateUsed: this.formatDate(new Date())
    };
  }

  mapBudgetEntries(entries: ExpensesBudgetResponseDto[]): BudgetEntryResponseDto[] {
    return entries.map(entry => this.toBudgetEntryData(entry));
  }

  formatDate(date: any): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd') || '';
  }

  onBudgetCategoryChange(entry: BudgetEntryResponseDto): void {
    const selectedCategory = this.budgetCategoryData.find(
        bc => bc.budgetCategoryId === entry.budgetCategoryId
    );
    entry.budgetCategoryName = selectedCategory ? selectedCategory.budgetCategoryName : '';
    entry.expenseCategoryId = undefined;
  }

  onSync(): void {
    const dateUsed = this.formatDate(this.dateUsed);
    const data = this.unbudgetedExpensesData;
    let isValid = true;

    if (!dateUsed) {
        this.snackbar.warning('Please select Date Used!');
    }
    else {
      for (let entry of data) {
        if (!entry.budgetCategoryId || !entry.description || (entry.budgetCategoryName === 'Other Expenses' && !entry.expenseCategoryId)) {
            isValid = false;
            break;
        }
      }

      if (isValid) {
        let requestData: BudgetEntryRequestDto[] = [];

        for(let entry of data) {
          requestData.push({
            budgetCategoryId: entry.budgetCategoryId,
            expenseCategoryId: entry.expenseCategoryId ?? 0,
            description: entry.description,
            amount: entry.amount,
            dateUsed: dateUsed
          });
        }

        this.confirm.openConfirm({
          title: 'Sync Unbudgeted Expenses?',
          message: 'Are you sure you want to sync these unbudgeted expenses?',
          confirmText: 'Yes',
          cancelText: 'No',
          icon: 'question'
        }).subscribe(result => {
          if (result) {
            this.syncBudgetEntries(requestData);
          }
        });
      } else {
          this.snackbar.warning('Please fill in all required fields!');
      }
    }
  }
}