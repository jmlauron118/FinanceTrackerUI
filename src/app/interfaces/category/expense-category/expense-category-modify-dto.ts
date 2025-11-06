import { ExpenseCategoryRequestDto } from "./expense-category-request-dto";

export interface ExpenseCategoryModifyDto extends ExpenseCategoryRequestDto {
    expenseCategoryId: number;
}
