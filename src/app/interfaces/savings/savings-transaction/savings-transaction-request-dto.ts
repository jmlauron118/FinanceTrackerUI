export interface SavingsTransactionRequestDto {
    transactionTypeId: number;
    investmentTypeId?: number;
    description: string;
    amount: number;
    status: number;
    dateUsed: string;
}
