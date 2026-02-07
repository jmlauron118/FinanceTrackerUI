import { Routes } from '@angular/router';
import { LoginComponent } from './modules/login/login.component';
import { LayoutComponent } from './layout/layout.component';
import { authGuard } from './guards/auth.guard';
import { loginGuard } from './guards/login.guard';
import { ForbiddenComponent } from './shared/pages/forbidden/forbidden.component';
import { CategoryComponent } from './modules/category/category.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { UserManagerComponent } from './modules/usermanager/usermanager.component';
import { BudgetEntryListComponent } from './modules/budgetmanager/budget-entry-list/budget-entry-list.component';
import { ExpensesBudgetListComponent } from './modules/budgetmanager/expenses-budget-list/expenses-budget-list.component';
import { SavingsTransactionComponent } from './modules/savings/savings-transaction/savings-transaction.component';
import { InvestmentTypeComponent } from './modules/category/partials/investment-type/investment-type.component';
import { InvestmentsComponent } from './modules/savings/investments/investments.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent, canActivate: [loginGuard]},
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: 'dashboard',
                component: DashboardComponent,
                canActivate: [authGuard],
                data: { moduleName: 'dashboard' }
            },
            {
                path: 'budgetentrylist',
                component: BudgetEntryListComponent,
                canActivate: [authGuard],
                data: { moduleName: 'budgetentrylist' }
            },
            {
                path: 'expensesbudgetlist',
                component: ExpensesBudgetListComponent,
                canActivate: [authGuard],
                data: { moduleName: 'expensesbudgetlist' }
            },
            {
                path: 'savingstransaction',
                component: SavingsTransactionComponent,
                canActivate: [authGuard],
                data: { moduleName: 'savingstransaction' }
            },
            {
                path: 'investments',
                component: InvestmentsComponent,
                canActivate: [authGuard],
                data: { moduleName: 'investments' }
            },
            {
                path: 'category',
                component: CategoryComponent,
                canActivate: [authGuard],
                data: { moduleName: 'category' }
            },
            {
                path: 'usermanager',
                component: UserManagerComponent,
                canActivate: [authGuard],
                data: { moduleName: 'usermanager' } 
            }
        ]
    },
    {
        path: '**',
        component: ForbiddenComponent
    }
];
