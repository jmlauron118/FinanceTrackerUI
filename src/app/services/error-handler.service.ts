import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class ErrorHandlerService {
    constructor() {}  
    handleError(error: any) {
        let errorMessage = 'An unexpected error occurred! Please contact support.';

        if(error instanceof HttpErrorResponse && error.status === 500) {
            errorMessage = 'Unable to connect to the server. Please contact your system administrator for assistance.';
        }
        else if(typeof ErrorEvent!== 'undefined' && error.error instanceof ErrorEvent) {
            errorMessage = `Client Error: ${error.error.message}`;
        }
        else if (error && typeof error.status !== 'undefined') {
            errorMessage = `Server error (${error.status}): ${error.statusText || 'No message returned from server.'}`;
        }
        else if(error && error.message) {
            errorMessage = error.message;
        }

        return throwError(() => errorMessage);
    }
}

