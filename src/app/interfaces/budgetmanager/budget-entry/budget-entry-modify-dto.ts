import { BudgetEntryRequestDto } from "./budget-entry-request-dto";

export interface BudgetEntryModifyDto extends BudgetEntryRequestDto {
    budgetEntryId: number;
}
