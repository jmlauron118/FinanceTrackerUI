import { BudgetCategoryRequestDto } from "./budget-category-request-dto";

export interface BudgetCategoryResponseDto extends BudgetCategoryRequestDto{
    budgetCategoryId: number;
}
