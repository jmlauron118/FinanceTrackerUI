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
  getAllBudgetCategories(status: number = 2): Observable<BudgetCategoryResponseDto[]> {
    const params = new HttpParams().set('status', status.toString());

    return this.http.get<BudgetCategoryResponseDto[]>(`${this.apiUrl}/get-all-budget-categories`, { params })
      .pipe(catchError(err => this.errorHandler.handleError(err)));
  }

  addBudgetCategory(budgetCategory: BudgetCategoryRequestDto): Observable<BudgetCategoryResponseDto> {
    return this.http.post<BudgetCategoryResponseDto>(`${this.apiUrl}/add-budget-category`, budgetCategory)
      .pipe(catchError(err => this.errorHandler.handleError(err)));
  }

  modifyBudgetCategory(budgetCategory: BudgetCategoryModifyDto): Observable<BudgetCategoryResponseDto> {
    return this.http.put<BudgetCategoryResponseDto>(`${this.apiUrl}/modify-budget-category`, budgetCategory)
      .pipe(catchError(err => this.errorHandler.handleError(err)));
  }
  //#endregion Budget Category

  //#region Expense Category
  getAllExpenseCategories(status: number = 2): Observable<ExpenseCategoryResponseDto[]> {
    const params = new HttpParams().set('status', status.toString());

    return this.http.get<ExpenseCategoryResponseDto[]>(`${this.apiUrl}/get-all-expense-categories`, { params })
      .pipe(catchError(err => this.errorHandler.handleError(err)));
  }

  addExpenseCategory(expenseCategory: ExpenseCategoryRequestDto): Observable<ExpenseCategoryResponseDto> {
    return this.http.post<ExpenseCategoryResponseDto>(`${this.apiUrl}/add-expense-category`, expenseCategory)
      .pipe(catchError(err => this.errorHandler.handleError(err)));
  }

  modifyExpenseCategory(expenseCategory: ExpenseCategoryModifyDto): Observable<ExpenseCategoryRequestDto> {
    return this.http.put<ExpenseCategoryRequestDto>(`${this.apiUrl}/modify-expense-category`, expenseCategory)
      .pipe(catchError(err => this.errorHandler.handleError(err)));
  }
  //#endregion Expense Category
}
