import { Routes } from '@angular/router';
import { LoginComponent } from './modules/login/login.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent},
    {
        path: 'dashboard',
        loadChildren: () => import('./modules/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES)
    },
    {
        path: 'usermanager',
        loadChildren: () => import('./modules/usermanager/usermanager.routes').then(m => m.USERMANAGER_ROUTES)
    },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: '**', redirectTo: 'login' }
];
