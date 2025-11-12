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

export const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
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
            },
            {
                path: 'budgetmanager',
                component: BudgetEntryListComponent,
                canActivate: [authGuard],
                data: { moduleName: 'budgetmanager' }
            }
        ]
    },
    {
        path: '**',
        component: ForbiddenComponent
    }
];
