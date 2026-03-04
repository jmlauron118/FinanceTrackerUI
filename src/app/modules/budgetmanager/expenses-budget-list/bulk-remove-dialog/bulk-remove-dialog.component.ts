import { Component, ViewEncapsulation, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from 'app/shared/material.module';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BudgetmanagerService } from '@services/budgetmanager/budgetmanager.service';
import { SnackbarService } from '@services/snackbar.service';
import { ConfirmDialogService } from '@services/confirm-dialog.service';
import { SelectionService } from '@services/selection.service';
import { ExpensesBudgetResponseDto } from '@interfaces/budgetmanager/expenses-budget/expenses-budget-response-dto';

@Component({
  selector: 'app-bulk-remove-dialog',
  imports: [CommonModule, FormsModule, MaterialModule],
  templateUrl: './bulk-remove-dialog.component.html',
  styleUrls: ['./bulk-remove-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BulkRemoveDialogComponent {
  expensesBudgetData: ExpensesBudgetResponseDto[] = [];
  categoryId = 0;
  dialogTitle = '';
  totalAmount = 0;

  constructor(
    private dialogRef: MatDialogRef<BulkRemoveDialogComponent>,
    private budgetManagerService: BudgetmanagerService,
    private snackbar: SnackbarService,
    private confirm: ConfirmDialogService,
    public selection: SelectionService<{ id: number }>,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    this.expensesBudgetData = data.expensesBudgetData || [];
    this.categoryId = this.expensesBudgetData[0].expensesBudgetCategoryId || 0;
    this.dialogTitle = data.title;
    this.calculateTotalAmount();
  }

  ngOnInit(): void {
    this.initSelection();
  }

  initSelection(): void {
    this.selection.setItems(this.expensesBudgetData.map(e => ({ id: e.id })));
    this.selection.clear();
    this.selection.indeterminate = false;
    this.calculateTotalAmount();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  getExpensesBudgetData(categoryId: number): void {
    this.budgetManagerService.getExpensesBudgetByCategory(categoryId).subscribe({
      next: response => {
        this.expensesBudgetData = response.data;
        this.initSelection();
      },
      error: err => {
        this.snackbar.danger(err, 5000);
      }
    });
  }

  saveExpensesBudget(dataRequest: ExpensesBudgetResponseDto[], categoryId: number): void {
    this.budgetManagerService.addExpensesBudgetBulk(dataRequest, categoryId).subscribe({
      next: () => {
        this.snackbar.success("Successfully removed!", 5000);
        this.getExpensesBudgetData(categoryId);
      },
      error: err => {
        this.snackbar.danger(err, 5000);
      }
    });
  }

  onRemoveSelected(): void {
    this.confirm.openConfirm({
      title: 'Remove Selected?',
      message: `Are you sure you want to remove ${this.selection.getSelectedCount() > 1 ? 'these items' : 'this item'} from the ${this.dialogTitle.toLowerCase()}?`,
      confirmText: 'Yes',
      cancelText: 'No',
      icon: 'warning'
    }).subscribe(result => {
      if (result) {
        const selectedIds = this.selection.getSelectedIds();
        const remainingItems = this.expensesBudgetData.filter(item => !selectedIds.includes(item.id));
        this.saveExpensesBudget(remainingItems, this.categoryId);
      }
    });
  }

  calculateTotalAmount(): void {
    this.totalAmount = this.expensesBudgetData.reduce((total, ed) => total + ed.amount, 0);
  }
}
