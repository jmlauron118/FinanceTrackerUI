import { BudgetCategoryRequestDto } from "../budget-category-dto/budget-category-request-dto";

export interface ExpenseCategoryResponseDto extends BudgetCategoryRequestDto {
    expenseCategoryId: number;
}
