export interface BudgetEntryResponseDto {
    budgetEntryId: number,
    budgetCategoryId: number;
    budgetCategoryName: string,
    expenseCategoryId?: number;
    expenseCategoryName?: string;
    description: string;
    amount: number;
    dateUsed: string;
}
