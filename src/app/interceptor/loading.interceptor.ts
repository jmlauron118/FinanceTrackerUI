import { inject } from "@angular/core";
import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { LoadingService } from "@services/loading.service";
import { finalize } from "rxjs";

export const LoadingInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
    const loading = inject(LoadingService);

    loading.show();
    
    return next(req).pipe(
        finalize(() => {
            loading.hide()
        })
    );
}