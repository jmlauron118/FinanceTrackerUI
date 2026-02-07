import { InvestmentTypeRequestDto } from "./investment-type-request-dto";

export interface InvestmentTypeModifyDto extends InvestmentTypeRequestDto {
    investmentTypeId: number;
}
