import { ModuleActionRequestDto } from "./module-action-request-dto";

export interface ModuleActionModifyDto extends ModuleActionRequestDto {
    moduleActionId: number;
}
