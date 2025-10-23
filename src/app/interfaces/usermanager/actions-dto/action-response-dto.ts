import { ActionRequestDto } from "./action-request-dto";

export interface ActionResponseDto extends ActionRequestDto {
    actionId: number;
}
