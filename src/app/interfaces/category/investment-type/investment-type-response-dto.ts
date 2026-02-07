import { InvestmentTypeRequestDto } from "./investment-type-request-dto";

export interface InvestmentTypeResponseDto extends InvestmentTypeRequestDto {
    investmentTypeId: number;
}
