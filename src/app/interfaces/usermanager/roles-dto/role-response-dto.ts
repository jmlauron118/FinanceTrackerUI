import { RoleRequestDto } from "./role-request-dto";

export interface RoleResponseDto extends RoleRequestDto {
    roleId: number;
}
