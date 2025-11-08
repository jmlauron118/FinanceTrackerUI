import { ExpenseCategoryRequestDto } from "./expense-category-request-dto";

export interface ExpenseCategoryResponseDto extends ExpenseCategoryRequestDto {
    expenseCategoryId: number;
}
