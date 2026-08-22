export interface InvestmentResponseDto {
    investmentId: number;
    investmentDate: string;
    investmentTypeName: string;
    description: string;
    investmentAmount: number;
    returnedAmount: number;
    returnTransactionId: number | null;
    realizedAmount: number;
    returnDate: string;
}
