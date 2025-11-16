import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { ErrorHandlerService } from '@services/error-handler.service';
import { BudgetEntryResponseDto } from '@interfaces/budgetmanager/budget-entry/budget-entry-response-dto';
import { PaginationMetadata } from '@interfaces/pagination-metadata';
import { ResponseModel } from '@interfaces/response-model';
import { BudgetEntryRequestDto } from '@interfaces/budgetmanager/budget-entry/budget-entry-request-dto';
import { BudgetEntryModifyDto } from '@interfaces/budgetmanager/budget-entry/budget-entry-modify-dto';
import { BudgetEntryDeleteDto } from '@interfaces/budgetmanager/budget-entry/budget-entry-delete-dto';

@Injectable({
  providedIn: 'root'
})
export class BudgetmanagerService {
  private readonly apiUrl = '/api/budgetmanager';

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService
  ) { }

  //#region Budget Entry
  getBudgetEntries(pageNumber = 1, pageSize = 20, search: string)
    : Observable<{items: ResponseModel<BudgetEntryResponseDto[]>, meta: PaginationMetadata | null}> {
    let params = new HttpParams()
                  .set('pageNumber', pageNumber.toString())
                  .set('pageSize', pageSize.toString())
                  .set('search', search);

    return this.http.get<ResponseModel<BudgetEntryResponseDto[]>>(`${this.apiUrl}/get-budget-entires`, { params, observe: 'response'})
      .pipe(
        map((resp: HttpResponse<ResponseModel<BudgetEntryResponseDto[]>>) => {
          const items: ResponseModel<BudgetEntryResponseDto[]> = {
            data: resp.body?.data ?? [],
            message: resp.body?.message ?? ''
          };
          const header = resp.headers.get('X-Pagination');
          let meta: PaginationMetadata | null = null;

          if (header) {
            try {
              meta = JSON.parse(header) as PaginationMetadata;
            }
            catch {
              meta = null
            }
          }

          return { items, meta };
        }),
        catchError(err => this.errorHandler.handleError(err))
      );
  }

  addBudgetEntry(budgetRequest: BudgetEntryRequestDto): Observable<ResponseModel<BudgetEntryResponseDto>> {
    return this.http.post<ResponseModel<BudgetEntryResponseDto>>(`${this.apiUrl}/add-budget-entry`, budgetRequest)
      .pipe(catchError(err => this.errorHandler.handleError(err)));
  }

  modifyBudgetEntry(budgetRequest: BudgetEntryModifyDto): Observable<ResponseModel<BudgetEntryResponseDto>> {
    return this.http.put<ResponseModel<BudgetEntryResponseDto>>(`${this.apiUrl}/modify-budget-entry`, budgetRequest)
      .pipe(catchError(err => this.errorHandler.handleError(err)));
  }

  removeBudgetEntry(id: number) {
    const params = new HttpParams().set('id', id.toString());
    return this.http.delete<ResponseModel<any>>(`${this.apiUrl}/remove-budget-entry`, {params})
      .pipe(catchError(err => this.errorHandler.handleError(err)));
  }

  removeBudgetEntryBulk(idList: BudgetEntryDeleteDto[]) {
    return this.http.delete<ResponseModel<any>>(`${this.apiUrl}/remove-budget-entry-bulk`, {body: idList})
      .pipe(catchError(err => this.errorHandler.handleError(err)));
  }
  //#endregion Budget Entry
}
