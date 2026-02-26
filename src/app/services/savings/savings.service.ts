import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseModel } from '@interfaces/response-model';
import { InvestmentResponseDto } from '@interfaces/savings/investment/investment-response-dto';
import { ReturnFromInvestmentDto } from '@interfaces/savings/investment/return-from-investment-dto';
import { ReturnSavingsTransactionDto } from '@interfaces/savings/investment/return-savings-transaction-dto';
import { SavingsSummaryResponseDto } from '@interfaces/savings/savings-transaction/savings-summary-response-dto';
import { SavingsTransactionModifyDto } from '@interfaces/savings/savings-transaction/savings-transaction-modify-dto';
import { SavingsTransactionRequestDto } from '@interfaces/savings/savings-transaction/savings-transaction-request-dto';
import { SavingsTransactionResponseDto } from '@interfaces/savings/savings-transaction/savings-transaction-response-dto';
import { ErrorHandlerService } from '@services/error-handler.service';
import { catchError, Observable } from 'rxjs';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SavingsService {
  private readonly apiUrl = environment.apiUrl + '/savings';

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService
  ){}

  getAllSavingsTransaction(): Observable<ResponseModel<SavingsTransactionResponseDto[]>> {
    return this.http.get<ResponseModel<SavingsTransactionResponseDto[]>>(`${this.apiUrl}/get-all-savings-transactions`)
      .pipe(catchError(err => this.errorHandler.handleError(err)));
  }

  getSavingsSummary(): Observable<ResponseModel<SavingsSummaryResponseDto>> {
      return this.http.get<ResponseModel<SavingsSummaryResponseDto>>(`${this.apiUrl}/get-savings-summary`)
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

  getAllInvestments(): Observable<ResponseModel<InvestmentResponseDto[]>>{
    return this.http.get<ResponseModel<InvestmentResponseDto[]>>(`${this.apiUrl}/get-all-investments`)
      .pipe(catchError(err => this.errorHandler.handleError(err)));
  }

  returnFromInvestment(request: ReturnFromInvestmentDto): Observable<ResponseModel<any>> {
    return this.http.post<ResponseModel<any>>(`${this.apiUrl}/return-from-investment`, request)
      .pipe(catchError(err => this.errorHandler.handleError(err)));
  }

  getReturnSavingsInvestment(returnTransactionId: number): Observable<ResponseModel<ReturnSavingsTransactionDto>> {
    let params = new HttpParams().set('returnTransactionId', returnTransactionId.toString());

    return this.http.get<ResponseModel<ReturnSavingsTransactionDto>>(`${this.apiUrl}/get-return-savings-transaction`, { params })
      .pipe(catchError(err => this.errorHandler.handleError(err)));
  }
}
