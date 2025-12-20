import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-expenses-budget-list',
  imports: [CommonModule],
  templateUrl: './expenses-budget-list.component.html',
  styleUrls: ['./expenses-budget-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ExpensesBudgetListComponent {
  title = 'Expenses Budget List';
}
