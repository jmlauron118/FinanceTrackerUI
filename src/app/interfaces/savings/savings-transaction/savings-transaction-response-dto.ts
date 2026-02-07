import { SavingsTransactionRequestDto } from "./savings-transaction-request-dto";

export interface SavingsTransactionResponseDto extends SavingsTransactionRequestDto {
    transactionId: number;
    transactionTypeName: string;
}
