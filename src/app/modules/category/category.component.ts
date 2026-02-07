import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BudgetCategoryComponent } from './partials/budget-category/budget-category.component';
import { ExpenseCategoryComponent } from './partials/expense-category/expense-category.component';
import { MatButtonModule } from '@angular/material/button';
import { SnackbarService } from '@services/snackbar.service';
import { SavingsTransactionTypeComponent } from './partials/savings-transaction-type/savings-transaction-type.component';
import { InvestmentTypeComponent } from './partials/investment-type/investment-type.component';

@Component({
  selector: 'app-category',
  imports: [CommonModule, BudgetCategoryComponent, ExpenseCategoryComponent, MatButtonModule, SavingsTransactionTypeComponent, InvestmentTypeComponent],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CategoryComponent {
  title = 'Categories';
  activeTab = 'budget';
  showTab = 'budget';

  @ViewChild(BudgetCategoryComponent) budgetCategoryComponent!: BudgetCategoryComponent;
  @ViewChild(ExpenseCategoryComponent) expenseCategoryComponent!: ExpenseCategoryComponent;
  @ViewChild(SavingsTransactionTypeComponent) transactionTypeComponent!: SavingsTransactionTypeComponent;
  @ViewChild(InvestmentTypeComponent) investmentTypeComponent!: InvestmentTypeComponent;

  constructor (
    private snackbar: SnackbarService
  ) {}

  setActiveTab(tab: string) {
    this.activeTab = tab;

    setTimeout(() => {
      this.showTab = tab;
      this.onTabChange(tab);
    }, 200);
  }

  isActive(tab: string): boolean {
    return this.activeTab === tab;
  }

  isShown(tab: string): boolean {
    return this.showTab === tab;
  }

  onTabChange(tab: string): void {
    const tabAction: Record<string, () => void> = {
      'budget' : () => this.budgetCategoryComponent.getAllBudgetCategories(),
      'expense' : () => this.expenseCategoryComponent.getAllExpenseCategories(),
      'transaction-type' : () => this.transactionTypeComponent.getAllSavingsTransactionTypes(),
      'investment-type' : () => this.investmentTypeComponent.getAllInvestmentTypes()
    };

    tabAction[tab] ? tabAction[tab]() : this.snackbar.warning(`Unknown tab: ${tab}`);
  }
}
