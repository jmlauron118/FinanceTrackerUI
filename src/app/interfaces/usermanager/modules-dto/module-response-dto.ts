import { ModuleRequestDto } from "./module-request-dto";

export interface ModuleResponseDto extends ModuleRequestDto {
    moduleId: number;
}
