import { ExpensesBudgetRequestDto } from "./expenses-budget-request-dto";

export interface ExpensesBudgetResponseDto extends ExpensesBudgetRequestDto {
    id: number;
}
