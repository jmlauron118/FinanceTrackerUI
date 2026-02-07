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
import { TransactionTypeResponseDto } from '@interfaces/category/savings-transaction-type/transaction-type-response-dto';
import { TransactionTypeRequestDto } from '@interfaces/category/savings-transaction-type/transaction-type-request-dto';
import { TransactionTypeModifyDto } from '@interfaces/category/savings-transaction-type/transaction-type-modify-dto';
import { InvestmentTypeResponseDto } from '@interfaces/category/investment-type/investment-type-response-dto';
import { InvestmentTypeRequestDto } from '@interfaces/category/investment-type/investment-type-request-dto';
import { InvestmentTypeModifyDto } from '@interfaces/category/investment-type/investment-type-modify-dto';

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

  //#region Savings Transaction Type
  getAllSavingsTransactionTypes(status: number = 2, type: number = 2): Observable<ResponseModel<TransactionTypeResponseDto[]>> {
    const params = new HttpParams()
                        .set('status', status.toString())
                        .set('type', type.toString());

    return this.http.get<ResponseModel<TransactionTypeResponseDto[]>>(`${this.apiUrl}/get-all-savings-transaction-types`, { params })
      .pipe(catchError(err => this.errorHandler.handleError(err)));
  }

  addSavingsTransactionType(request: TransactionTypeRequestDto): Observable<ResponseModel<TransactionTypeResponseDto>> {
    return this.http.post<ResponseModel<TransactionTypeResponseDto>>(`${this.apiUrl}/add-savings-transaction-type`, request)
      .pipe(catchError(err => this.errorHandler.handleError(err)));
  };

  modifySavingsTransactionType(request: TransactionTypeModifyDto): Observable<ResponseModel<TransactionTypeResponseDto>> {
    return this.http.put<ResponseModel<TransactionTypeResponseDto>>(`${this.apiUrl}/modify-savings-transaction-type`, request)
      .pipe(catchError(err => this.errorHandler.handleError(err)));
  };
  //#endregion Savings Transaction Type

  //#region Investment Type
  getAllInvestmentTypes(status: number = 2): Observable<ResponseModel<InvestmentTypeResponseDto[]>> {
    const params = new HttpParams().set('status', status.toString());

    return this.http.get<ResponseModel<InvestmentTypeResponseDto[]>>(`${this.apiUrl}/get-all-investment-types`, { params })
      .pipe(catchError(err => this.errorHandler.handleError(err)));
  }

  addInvestmentType(request: InvestmentTypeRequestDto): Observable<ResponseModel<InvestmentTypeResponseDto>> {
    return this.http.post<ResponseModel<InvestmentTypeResponseDto>>(`${this.apiUrl}/add-investment-type`, request)
      .pipe(catchError(err => this.errorHandler.handleError(err)));
  };

  modifyInvestmentType(request: InvestmentTypeModifyDto): Observable<ResponseModel<InvestmentTypeResponseDto>> {
    return this.http.put<ResponseModel<InvestmentTypeResponseDto>>(`${this.apiUrl}/modify-investment-type`, request)
      .pipe(catchError(err => this.errorHandler.handleError(err)));
  };
  //#endregion Investment Type
}
