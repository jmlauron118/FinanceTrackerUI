export interface RecentTransactionsDto {
    budgetEntryId: number;
    budgetCategoryId: number;
    budgetCategoryName: string;
    description: string;
    amount: number;
    dateUsed: string;
}
