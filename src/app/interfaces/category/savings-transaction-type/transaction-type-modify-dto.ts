import { TransactionTypeRequestDto } from "./transaction-type-request-dto";

export interface TransactionTypeModifyDto extends TransactionTypeRequestDto {
    transactionTypeId: number;
}
