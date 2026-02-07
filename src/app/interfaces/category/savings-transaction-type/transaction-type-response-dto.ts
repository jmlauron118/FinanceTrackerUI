import { TransactionTypeRequestDto } from "./transaction-type-request-dto";

export interface TransactionTypeResponseDto extends TransactionTypeRequestDto {
    transactionTypeId: number;
}
