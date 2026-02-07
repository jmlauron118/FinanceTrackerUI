import { SavingsTransactionRequestDto } from "./savings-transaction-request-dto";

export interface SavingsTransactionModifyDto extends SavingsTransactionRequestDto {
    transactionId: number;
}
