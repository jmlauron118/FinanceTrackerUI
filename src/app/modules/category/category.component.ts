import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BudgetCategoryComponent } from './partials/budget-category/budget-category.component';
import { ExpenseCategoryComponent } from './partials/expense-category/expense-category.component';
import { MatButtonModule } from '@angular/material/button';
import { SnackbarService } from '@services/snackbar.service';

@Component({
  selector: 'app-category',
  imports: [CommonModule, BudgetCategoryComponent, ExpenseCategoryComponent, MatButtonModule],
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
      'expense' : () => this.expenseCategoryComponent.getAllExpenseCategories()
    };

    tabAction[tab] ? tabAction[tab]() : this.snackbar.warning(`Unknown tab: ${tab}`);
  }
}
