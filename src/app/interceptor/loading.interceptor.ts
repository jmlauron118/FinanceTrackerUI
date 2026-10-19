import { inject } from "@angular/core";
import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { LoadingService } from "@services/loading.service";
import { finalize } from "rxjs";

export const LoadingInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
    const loading = inject(LoadingService);

    // Exempt budget entry API calls from showing the loading indicator
    const exemptUrls = [
        'api/usermanager/get-user-modules', 
        'api/budgetmanager'
    ]; // Add the specific endpoint(s) here

    const hasButtonLoading = (req.method === 'POST' || req.method === 'PUT') &&
        /\/api\/(?:category|usermanager|savings)\/(?:add-|modify-|change-password)/.test(req.url);
    const isExempt = exemptUrls.some(url => req.url.includes(url)) || hasButtonLoading;

    if (!isExempt) {
        loading.show();
    }

    return next(req).pipe(
        finalize(() => {
            if (!isExempt) {
                loading.hide();
            }
        })
    );
};
