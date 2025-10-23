import { UserRoleRequestDto } from "./user-role-request-dto";

export interface UserRoleModifyDto extends UserRoleRequestDto {
    userRoleId: number;
}
