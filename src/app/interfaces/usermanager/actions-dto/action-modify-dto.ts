import { ActionRequestDto } from "./action-request-dto";

export interface ActionModifyDto extends ActionRequestDto {
    actionId: number;
}
