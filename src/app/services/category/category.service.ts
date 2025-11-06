import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ErrorHandlerService } from '@services/error-handler.service';
import { catchError, Observable } from 'rxjs';
import { BudgetCategoryResponseDto } from '@interfaces/category/budget-category-dto/budget-category-response-dto';
import { BudgetCategoryRequestDto } from '@interfaces/category/budget-category-dto/budget-category-request-dto';
import { BudgetCategoryModifyDto } from '@interfaces/category/budget-category-dto/budget-category-modify-dto';
import { ExpenseCategoryResponseDto } from '@interfaces/category/expense-category/expense-category-response-dto';
import { ExpenseCategoryRequestDto } from '@interfaces/category/expense-category/expense-category-request-dto';
import { ExpenseCategoryModifyDto } from '@interfaces/category/expense-category/expense-category-modify-dto';
import { ResponseModel } from '@interfaces/response-model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly apiUrl = '/api/category'

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService
  ) { }

  //#region Budget Category
  getAllBudgetCategories(status: number = 2): Observable<ResponseModel<BudgetCategoryResponseDto[]>> {
    const params = new HttpParams().set('status', status.toString());

    return this.http.get<ResponseModel<BudgetCategoryResponseDto[]>>(`${this.apiUrl}/get-all-budget-categories`, { params })
      .pipe(catchError(err => this.errorHandler.handleError(err)));
  }

  addBudgetCategory(budgetCategory: BudgetCategoryRequestDto): Observable<ResponseModel<BudgetCategoryResponseDto>> {
    return this.http.post<ResponseModel<BudgetCategoryResponseDto>>(`${this.apiUrl}/add-budget-category`, budgetCategory)
      .pipe(catchError(err => this.errorHandler.handleError(err)));
  }

  modifyBudgetCategory(budgetCategory: BudgetCategoryModifyDto): Observable<ResponseModel<BudgetCategoryResponseDto>> {
    return this.http.put<ResponseModel<BudgetCategoryResponseDto>>(`${this.apiUrl}/modify-budget-category`, budgetCategory)
      .pipe(catchError(err => this.errorHandler.handleError(err)));
  }
  //#endregion Budget Category

  //#region Expense Category
  getAllExpenseCategories(status: number = 2): Observable<ResponseModel<ExpenseCategoryResponseDto[]>> {
    const params = new HttpParams().set('status', status.toString());

    return this.http.get<ResponseModel<ExpenseCategoryResponseDto[]>>(`${this.apiUrl}/get-all-expense-categories`, { params })
      .pipe(catchError(err => this.errorHandler.handleError(err)));
  }

  addExpenseCategory(expenseCategory: ExpenseCategoryRequestDto): Observable<ResponseModel<ExpenseCategoryResponseDto>> {
    return this.http.post<ResponseModel<ExpenseCategoryResponseDto>>(`${this.apiUrl}/add-expense-category`, expenseCategory)
      .pipe(catchError(err => this.errorHandler.handleError(err)));
  }

  modifyExpenseCategory(expenseCategory: ExpenseCategoryModifyDto): Observable<ResponseModel<ExpenseCategoryResponseDto>> {
    return this.http.put<ResponseModel<ExpenseCategoryResponseDto>>(`${this.apiUrl}/modify-expense-category`, expenseCategory)
      .pipe(catchError(err => this.errorHandler.handleError(err)));
  }
  //#endregion Expense Category
}
