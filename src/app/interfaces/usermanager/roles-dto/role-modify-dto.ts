import { RoleRequestDto } from "./role-request-dto";

export interface RoleModifyDto extends RoleRequestDto {
    roleId: number;
}
