import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from 'app/shared/material.module';
import { MatDialog } from '@angular/material/dialog';
import { BudgetmanagerService } from '@services/budgetmanager/budgetmanager.service';
import { SnackbarService } from '@services/snackbar.service';
import { ConfirmDialogService } from '@services/confirm-dialog.service';
import { ExpensesBudgetResponseDto } from '@interfaces/budgetmanager/expenses-budget/expenses-budget-response-dto';
import { SyncUnbudgetedExpensesDialogComponent } from './sync-unbudgeted-expenses-dialog/sync-unbudgeted-expenses-dialog.component';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop'

@Component({
  selector: 'app-expenses-budget-list',
  imports: [CommonModule, FormsModule, MaterialModule, DragDropModule],
  templateUrl: './expenses-budget-list.component.html',
  styleUrls: ['./expenses-budget-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ExpensesBudgetListComponent {
  title = 'Expenses Budget List';
  budgetedBtnAction = false;
  monthlyBtnAction = false;
  payrollBtnAction = false;
  budgetedData: ExpensesBudgetResponseDto[] = [];
  monthlyData: ExpensesBudgetResponseDto[] = [];
  payrollData: ExpensesBudgetResponseDto[] = [];
  budgetedLoading = false;
  monthlyLoading = false;
  payrollLoading = false;

  constructor(
    private budgetManagerService: BudgetmanagerService,
    private snackbar: SnackbarService,
    private confirm: ConfirmDialogService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getExpensesBudgetData(1); // Budgeted
    this.getExpensesBudgetData(2); // Monthly
    this.getExpensesBudgetData(3); // Payroll
  }

  onDrop(categoryId: number, event: CdkDragDrop<any[]>) {
    this.setMoveItemArray(categoryId, event);
  }

  setMoveItemArray(categoryId: number, event: CdkDragDrop<any[]>) {
    const actions: Record<number, () => void> = {
      1: () => moveItemInArray(this.budgetedData, event.previousIndex, event.currentIndex),
      2: () => moveItemInArray(this.monthlyData, event.previousIndex, event.currentIndex),
      3: () => moveItemInArray(this.payrollData, event.previousIndex, event.currentIndex)
    };

    actions[categoryId]?.();
  }

  toggleBtnAction(action: boolean): boolean {
    return !action;
  }

  toggleLoading(categoryId: number, action: boolean) {
    const actions: Record<number, () => void> = {
      1: () => this.budgetedLoading = action,
      2: () => this.monthlyLoading = action,
      3: () => this.payrollLoading = action
    };

    actions[categoryId]?.();
  }

  addRow(categoryId: number) {
    const data = { id: 0, expensesBudgetCategoryId: categoryId, description: '', amount: 0 };

    const actions: Record<number, () => void> = {
        1: () => this.budgetedData.push(data),
        2: () => this.monthlyData.push(data),
        3: () => this.payrollData.push(data)
      };
      
    actions[categoryId]?.();
  }

  removeRow(index: number, categoryId: number): void {
    const action: Record<number, () => void> = {
      1: () => this.budgetedData.splice(index, 1),
      2: () => this.monthlyData.splice(index, 1),
      3: () => this.payrollData.splice(index, 1)
    };

    action[categoryId]?.();
  }

  getTotal(data: ExpensesBudgetResponseDto[]): number {
    return data.reduce((sum, item) => sum + item.amount, 0);
  }

  setExpenseBudgetData(data: ExpensesBudgetResponseDto[], categoryId: number): void {
    const action: Record<number, () => void> = {
      1: () => this.budgetedData = data,
      2: () => this.monthlyData = data,
      3: () => this.payrollData = data
    };
    action[categoryId]?.();
  }

  getExpensesBudgetData(categoryId: number): void {
    this.toggleLoading(categoryId, true);
    this.budgetManagerService.getExpensesBudgetByCategory(categoryId).subscribe({
      next: response => {
        this.setExpenseBudgetData(response.data, categoryId);
      },
      error: err => {
        this.snackbar.danger(err, 5000);
        this.toggleLoading(categoryId, false);
      },
      complete: () => (this.toggleLoading(categoryId, false))
    });
  }

  saveExpensesBudget(dataRequest: ExpensesBudgetResponseDto[], categoryId: number): void {
    this.toggleLoading(categoryId, true);
    this.budgetManagerService.addExpensesBudgetBulk(dataRequest, categoryId).subscribe({
      next: response => {
        this.snackbar.success(response.message, 5000);
      },
      error: err => {
        this.toggleLoading(categoryId, false)
        this.snackbar.danger(err, 5000);
      },
      complete: () => (this.toggleLoading(categoryId, false))
    });
  }

  onBudgetedExpensesActionClick(): void {
    if(!this.budgetedBtnAction) {
      this.budgetedBtnAction = true;
    }
    else{
      this.confirm.openConfirm({
        title: 'Save Changes?',
        message: 'Are you sure you want to save the changes to the budgeted expenses?',
        confirmText: 'Yes',
        icon: 'info'
      }).subscribe(result => {
        if (result) {
          this.budgetedBtnAction = false;
          this.saveExpensesBudget(this.budgetedData, 1);
        }
      });
    }
  }

  onMonthlyExpensesActionClick(): void {
    if(!this.monthlyBtnAction) {
      this.monthlyBtnAction = true;
    }
    else{
      this.confirm.openConfirm({
        title: 'Save Changes?',
        message: 'Are you sure you want to save the changes to the unbudgeted expenses (monthly)?',
        confirmText: 'Yes',
        icon: 'info'
      }).subscribe(result => {
        if (result) {
          this.monthlyBtnAction = false;
          this.saveExpensesBudget(this.monthlyData, 2);
        }
      });
    }
  }

  onPayrollExpensesActionClick(): void {
    if(!this.payrollBtnAction) {
      this.payrollBtnAction = true;
    }
    else{
      this.confirm.openConfirm({
        title: 'Save Changes?',
        message: 'Are you sure you want to save the changes to the unbudgeted expenses (payroll)?',
        confirmText: 'Yes',
        icon: 'info'
      }).subscribe(result => {
        if (result) {
          this.payrollBtnAction = false;
          this.saveExpensesBudget(this.payrollData, 3);
        }
      });
    }
  }

  onSyncUnbudgetedExpenses(): void {
    if (this.payrollData.length > 0) {
      const dialogRef = this.dialog.open(SyncUnbudgetedExpensesDialogComponent, {
        panelClass: 'custom-dialog',
        width: '90vw',
        maxWidth: '100vw',
        disableClose: true
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result.status) {
          this.getExpensesBudgetData(1); // Budgeted
          this.getExpensesBudgetData(3); // Payroll
        }
      });
    }
    else {
      this.snackbar.warning('No unbudgeted expenses found!');
    }
  }
}
