import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseModel } from '@interfaces/response-model';
import { SavingsTransactionModifyDto } from '@interfaces/savings/savings-transaction/savings-transaction-modify-dto';
import { SavingsTransactionRequestDto } from '@interfaces/savings/savings-transaction/savings-transaction-request-dto';
import { SavingsTransactionResponseDto } from '@interfaces/savings/savings-transaction/savings-transaction-response-dto';
import { ErrorHandlerService } from '@services/error-handler.service';
import { catchError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SavingsService {
  private readonly apiUrl = '/api/savings';

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService
  ){}

  getAllSavingsTransaction(): Observable<ResponseModel<SavingsTransactionResponseDto[]>> {
    return this.http.get<ResponseModel<SavingsTransactionResponseDto[]>>(`${this.apiUrl}/get-all-savings-transactions`)
      .pipe(catchError(err => this.errorHandler.handleError(err)));
  }

  addSavingsTransaction(request: SavingsTransactionRequestDto): Observable<ResponseModel<any>> {
    return this.http.post<ResponseModel<any>>(`${this.apiUrl}/add-savings-transaction`, request)
      .pipe(catchError(err => this.errorHandler.handleError(err)));
  }

  modifySavingsTransaction(request: SavingsTransactionModifyDto): Observable<ResponseModel<any>> {
    return this.http.put<ResponseModel<any>>(`${this.apiUrl}/modify-savings-transaction`, request)
      .pipe(catchError(err => this.errorHandler.handleError(err)));
  }

  removeSavingsTransaction(transactionId: number): Observable<ResponseModel<any>>{
    let params = new HttpParams().set('transactionId', transactionId.toString());
    
    return this.http.delete<ResponseModel<any>>(`${this.apiUrl}/remove-savings-transaction`, { params })
      .pipe(catchError(err => this.errorHandler.handleError(err)));
  }
}
