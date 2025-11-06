import { BudgetCategoryRequestDto } from "./budget-category-request-dto";

export interface BudgetCategoryModifyDto extends BudgetCategoryRequestDto {
    budgetCategoryId: number;
}
