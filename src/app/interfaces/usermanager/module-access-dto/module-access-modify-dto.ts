import { ModuleAccessRequestDto } from "./module-access-request-dto";

export interface ModuleAccessModifyDto extends ModuleAccessRequestDto {
    moduleAccessId: number;
}
