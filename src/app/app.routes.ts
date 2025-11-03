import { Routes } from '@angular/router';
import { LoginComponent } from './modules/login/login.component';
import { LayoutComponent } from './layout/layout.component';
import { authGuard } from './guards/auth.guard';
import { loginGuard } from './guards/login.guard';
import { ForbiddenComponent } from './shared/pages/forbidden/forbidden.component';

export const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'login', component: LoginComponent, canActivate: [loginGuard]},
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: 'dashboard',
                loadChildren: () => import('./modules/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES),
                canActivate: [authGuard],
                data: { moduleName: 'dashboard' }
            },
            {
                path: 'usermanager',
                loadChildren: () => import('./modules/usermanager/usermanager.routes').then(m => m.USERMANAGER_ROUTES),
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
