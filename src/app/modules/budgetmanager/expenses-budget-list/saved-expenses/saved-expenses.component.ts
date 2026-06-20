import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from 'app/shared/material.module';
import { ExpensesBudgetResponseDto } from '@interfaces/budgetmanager/expenses-budget/expenses-budget-response-dto';
import { BudgetmanagerService } from '@services/budgetmanager/budgetmanager.service';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { SnackbarService } from '@services/snackbar.service';
import { ConfirmDialogService } from '@services/confirm-dialog.service';

@Component({
  selector: 'app-saved-expenses',
  imports: [CommonModule, FormsModule, MaterialModule, DragDropModule],
  templateUrl: './saved-expenses.component.html',
  styleUrls: ['./saved-expenses.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SavedExpensesComponent {
  expensesData: ExpensesBudgetResponseDto[] = [];
  budgetedBtnAction = false;
  savedExpensesLoading = false;

  constructor(
    private snackbar: SnackbarService,
    private budgetManagerService: BudgetmanagerService,
    private confirm: ConfirmDialogService
  ) {}

  ngOnInit(): void {
    this.getSavedExpensesData();
  }

  getSavedExpensesData(): void {
    this.savedExpensesLoading = true;
    this.budgetManagerService.getExpensesBudgetByCategory(2).subscribe({
      next: response => {
        this.expensesData = response.data || [];
      },
      error: err => {
        this.snackbar.danger(err, 5000);
        this.savedExpensesLoading = false;
      },
      complete: () => (this.savedExpensesLoading = false)
    });
  }

  onDrop(event: CdkDragDrop<any[]>) {
    this.setMoveItemArray(event);
  }

  setMoveItemArray(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.expensesData, event.previousIndex, event.currentIndex)
  }

  addRow() {
    const data = { id: 0, expensesBudgetCategoryId: 2, description: '', amount: 0 };

    this.expensesData.push(data);
  }

  removeRow(index: number): void {
     this.expensesData.splice(index, 1);
  }

  getTotal(data: ExpensesBudgetResponseDto[]): number {
    return data.reduce((sum, item) => sum + item.amount, 0);
  }

  onSavedExpensesActionClick(): void {
    if(!this.budgetedBtnAction) {
      this.budgetedBtnAction = true;
    }
    else{
      this.confirm.openConfirm({
        title: 'Save Changes?',
        message: 'Are you sure you want to save the changes?',
        confirmText: 'Yes',
        icon: 'info'
      }).subscribe(result => {
        if (result) {
          this.budgetedBtnAction = false;
          this.expensesData = this.expensesData.filter(item => item.description !== '' && item.amount !== 0);
          this.addSavedExpenses(this.expensesData);
        }
      });
    }
  }

  addSavedExpenses(dataRequest: ExpensesBudgetResponseDto[]): void {
    this.savedExpensesLoading = true;
    this.budgetManagerService.addExpensesBudgetBulk(dataRequest, 2).subscribe({
      next: response => {
        this.snackbar.success(response.message, 5000);
      },
      error: err => {
        this.savedExpensesLoading = false;
        this.snackbar.danger(err, 5000);
      },
      complete: () => (this.savedExpensesLoading = false)
    });
  }
}