import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RecentTransactionsDto } from '@interfaces/dashboard/recent-transactions-dto';
import { SummaryResponseDto } from '@interfaces/dashboard/summary-response-dto';
import { YtdIncomeResponseDto } from '@interfaces/dashboard/ytd-income-response-dto';
import { ResponseModel } from '@interfaces/response-model';
import { ErrorHandlerService } from '@services/error-handler.service';
import { Observable, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly apiUrl = '/api/dashboard';

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService
  ) { }

  getSummary(): Observable<ResponseModel<SummaryResponseDto>> {
    return this.http.get<ResponseModel<SummaryResponseDto>>(`${this.apiUrl}/get-summary`)
      .pipe(catchError(err => this.errorHandler.handleError(err)));
  }

  getRecentTransactions(): Observable<ResponseModel<RecentTransactionsDto[]>> {
    return this.http.get<ResponseModel<RecentTransactionsDto[]>>(`${this.apiUrl}/get-recent-transactions`)
      .pipe(catchError(err => this.errorHandler.handleError(err)));
  }
  
  getYTDIncome(): Observable<ResponseModel<YtdIncomeResponseDto[]>> {
    return this.http.get<ResponseModel<YtdIncomeResponseDto[]>>(`${this.apiUrl}/get-ytd-income`)
      .pipe(catchError(err => this.errorHandler.handleError(err)));
  }
}
