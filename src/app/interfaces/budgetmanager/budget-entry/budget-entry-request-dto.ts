export interface BudgetEntryRequestDto {
    budgetCategoryId: number;
    expenseCategoryId?: number;
    description: string;
    amount: number;
    dateUsed: string;
}
