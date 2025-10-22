import { ModuleRequestDto } from "./module-request-dto";

export interface ModuleModifyDto extends ModuleRequestDto {
    moduleId: number;
}
