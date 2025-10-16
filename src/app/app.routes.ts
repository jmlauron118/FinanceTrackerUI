import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'dashboard',
        loadChildren: () => import('./modules/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES)
    },
    {
        path: 'usermanager',
        loadChildren: () => import('./modules/usermanager/usermanager.routes').then(m => m.USERMANAGER_ROUTES)
    },
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
];
