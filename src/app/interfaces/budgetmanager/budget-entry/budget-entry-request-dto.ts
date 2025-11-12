export interface BudgetEntryRequestDto {
    budgetCategoryId: number;
    expenseCategoryId?: number;
    description: number;
    amount: number;
    dateUsed: string;
}
