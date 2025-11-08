import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { UserResponseDto } from '@interfaces/usermanager/users-dto/user-response-dto';
import { UserRequestDto } from '@interfaces/usermanager/users-dto/user-request-dto';
import { UserModifyDto } from '@interfaces/usermanager/users-dto/user-modify-dto';
import { ErrorHandlerService } from '@services/error-handler.service';
import { RoleResponseDto } from '@interfaces/usermanager/roles-dto/role-response-dto';
import { RoleRequestDto } from '@interfaces/usermanager/roles-dto/role-request-dto';
import { RoleModifyDto } from '@interfaces/usermanager/roles-dto/role-modify-dto';
import { ModuleResponseDto } from '@interfaces/usermanager/modules-dto/module-response-dto';
import { ModuleRequestDto } from '@interfaces/usermanager/modules-dto/module-request-dto';
import { ModuleModifyDto } from '@interfaces/usermanager/modules-dto/module-modify-dto';
import { ActionResponseDto } from '@interfaces/usermanager/actions-dto/action-response-dto';
import { ActionRequestDto } from '@interfaces/usermanager/actions-dto/action-request-dto';
import { ActionModifyDto } from '@interfaces/usermanager/actions-dto/action-modify-dto';
import { ModuleActionResponseDto } from '@interfaces/usermanager/module-actions-dto/module-action-response-dto';
import { ModuleActionRequestDto } from '@interfaces/usermanager/module-actions-dto/module-action-request-dto';
import { ModuleActionModifyDto } from '@interfaces/usermanager/module-actions-dto/module-action-modify-dto';
import { UserRoleResponseDto } from '@interfaces/usermanager/user-roles-dto/user-role-response-dto';
import { UserRoleRequestDto } from '@interfaces/usermanager/user-roles-dto/user-role-request-dto';
import { UserRoleModifyDto } from '@interfaces/usermanager/user-roles-dto/user-role-modify-dto';
import { ModuleAccessResponseDto } from '@interfaces/usermanager/module-access-dto/module-access-response-dto';
import { ModuleAccessRequestDto } from '@interfaces/usermanager/module-access-dto/module-access-request-dto';
import { ModuleAccessModifyDto } from '@interfaces/usermanager/module-access-dto/module-access-modify-dto';
import { ResponseModel } from '@interfaces/response-model';
import { ChangePasswordDto } from '@interfaces/login/change-password-dto';

@Injectable({
  providedIn: 'root'
})
export class UsermanagerService {
  private readonly apiUrl = '/api/usermanager'

  constructor(private http: HttpClient, private errorHandler: ErrorHandlerService) { }

  //#region users
  getAllUsers(status: number = 2): Observable<ResponseModel<UserResponseDto[]>> {
    const params = new HttpParams().set('status', status.toString());
    return this.http.get<ResponseModel<UserResponseDto[]>>(`${this.apiUrl}/get-all-users`, { params })
      .pipe(catchError(err => this.errorHandler.handleError(err)));
  }

  addUser(user: UserRequestDto): Observable<ResponseModel<UserResponseDto>> {
    return this.http.post<ResponseModel<UserResponseDto>>(`${this.apiUrl}/add-user`, user)
      .pipe(catchError(err => this.errorHandler.handleError(err)));
  }

  modifyUser(user: UserModifyDto): Observable<ResponseModel<UserResponseDto>> {
    return this.http.put<ResponseModel<UserResponseDto>>(`${this.apiUrl}/modify-user`, user)
      .pipe(catchError(err => this.errorHandler.handleError(err)));
  }

  changePassword(changePassword: ChangePasswordDto): Observable<ResponseModel<any>> {
    return this.http.put<any>(`${this.apiUrl}/change-password`, changePassword)
      .pipe(catchError(err => this.errorHandler.handleError(err)));
  }
  //#endregion Users

  //#region Roles 
  getAllRoles(status: number = 2): Observable<ResponseModel<RoleResponseDto[]>> {
    const params = new HttpParams().set('status', status.toString());
    return this.http.get<ResponseModel<RoleResponseDto[]>> (`${this.apiUrl}/get-all-roles`, { params })
      .pipe(catchError(err => this.errorHandler.handleError(err)));
  }

  addRole(role: RoleRequestDto): Observable<ResponseModel<RoleResponseDto>> {
    return this.http.post<ResponseModel<RoleResponseDto>>(`${this.apiUrl}/add-role`, role)
      .pipe(catchError(err => this.errorHandler.handleError(err)));
  }

  modifyRole(role: RoleModifyDto): Observable<ResponseModel<RoleResponseDto>> {
    return this.http.put<ResponseModel<RoleResponseDto>>(`${this.apiUrl}/modify-role`, role)
      .pipe(catchError(err => this.errorHandler.handleError(err)));
  }
  //#endregion Roles

  //#region Modules
  getAllModules(status: number = 2): Observable<ResponseModel<ModuleResponseDto[]>> {
    const params = new HttpParams().set('status', status.toString());
    return this.http.get<ResponseModel<ModuleResponseDto[]>>(`${this.apiUrl}/get-all-modules`, { params })
      .pipe(catchError(err => this.errorHandler.handleError(err)));
  }

  addModule(module: ModuleRequestDto): Observable<ResponseModel<ModuleResponseDto>> {
    return this.http.post<ResponseModel<ModuleResponseDto>>(`${this.apiUrl}/add-module`, module)
      .pipe(catchError(err => this.errorHandler.handleError(err)));
  }

  modifyModule(module: ModuleModifyDto): Observable<ResponseModel<ModuleResponseDto>> {
    return this.http.put<ResponseModel<ModuleResponseDto>>(`${this.apiUrl}/modify-module`, module)
      .pipe(catchError(err => this.errorHandler.handleError(err)));
  }
  //#endregion Modules

  //#region Actions
  getAllActions(status: number = 2): Observable<ResponseModel<ActionResponseDto[]>> {
    const params = new HttpParams().set('status', status.toString());
    return this.http.get<ResponseModel<ActionResponseDto[]>>(`${this.apiUrl}/get-all-actions`, { params })
      .pipe(catchError(err => this.errorHandler.handleError(err)));
  }

  addAction(action: ActionRequestDto): Observable<ResponseModel<ActionResponseDto>> {
    return this.http.post<ResponseModel<ActionResponseDto>>(`${this.apiUrl}/add-action`, action)
      .pipe(catchError(err => this.errorHandler.handleError(err)));
  }

  modifyAction(action: ActionModifyDto): Observable<ResponseModel<ActionResponseDto>> {
    return this.http.put<ResponseModel<ActionResponseDto>>(`${this.apiUrl}/modify-action`, action)
      .pipe(catchError(err => this.errorHandler.handleError(err)));
  }
  //#endregion Actions

  //#region Module Actions
  getAllModuleActions(): Observable<ResponseModel<ModuleActionResponseDto[]>> {
    return this.http.get<ResponseModel<ModuleActionResponseDto[]>>(`${this.apiUrl}/get-all-module-actions`)
      .pipe(catchError(err => this.errorHandler.handleError(err)));
  }

  addModuleAction(moduleAction: ModuleActionRequestDto): Observable<ResponseModel<ModuleActionResponseDto>> {
    return this.http.post<ResponseModel<ModuleActionResponseDto>>(`${this.apiUrl}/add-module-action`, moduleAction)
      .pipe(catchError(err => this.errorHandler.handleError(err)));
  }

  modifyModuleAction(moduleAction: ModuleActionModifyDto): Observable<ResponseModel<ModuleActionResponseDto>> {
    return this.http.put<ResponseModel<ModuleActionResponseDto>>(`${this.apiUrl}/modify-module-action`, moduleAction)
      .pipe(catchError(err => this.errorHandler.handleError(err)));
  }
  
  removeModuleAction(id: number) {
    const params = new HttpParams().set('id', id.toString());
    return this.http.delete<ResponseModel<object>>(`${this.apiUrl}/remove-module-action`, { params })
      .pipe(catchError(err => this.errorHandler.handleError(err)));
  }
  //#endregion Module Actions

  //#region User Roles
  getAllUserRoles(): Observable<ResponseModel<UserRoleResponseDto[]>> {
    return this.http.get<ResponseModel<UserRoleResponseDto[]>>(`${this.apiUrl}/get-all-user-roles`)
      .pipe(catchError(err => this.errorHandler.handleError(err)));
  }

  addUserRole(userRole: UserRoleRequestDto): Observable<ResponseModel<UserRoleResponseDto>> {
    return this.http.post<ResponseModel<UserRoleResponseDto>>(`${this.apiUrl}/add-user-role`, userRole)
      .pipe(catchError(err => this.errorHandler.handleError(err)));
  }
  
  modifyUserRole(userRole: UserRoleModifyDto): Observable<ResponseModel<UserRoleResponseDto>> {
    return this.http.put<ResponseModel<UserRoleResponseDto>>(`${this.apiUrl}/modify-user-role`, userRole)
      .pipe(catchError(err => this.errorHandler.handleError(err)));
  }

  removeUserRole(id: number) {
    const params = new HttpParams().set('id', id.toString());
    return this.http.delete<ResponseModel<object>>(`${this.apiUrl}/remove-user-role`, { params })
      .pipe(catchError(err => this.errorHandler.handleError(err)));
  }
  //#endregion User Roles
  
  //#region Module Access
  getAllModuleAccess(): Observable<ResponseModel<ModuleAccessResponseDto[]>> {
    return this.http.get<ResponseModel<ModuleAccessResponseDto[]>>(`${this.apiUrl}/get-all-module-access`)
      .pipe(catchError(err => this.errorHandler.handleError(err)));
  }

  addModuleAccess(moduleAccess: ModuleAccessRequestDto): Observable<ResponseModel<ModuleAccessResponseDto>> {
    return this.http.post<ResponseModel<ModuleAccessResponseDto>>(`${this.apiUrl}/add-module-access`, moduleAccess)
      .pipe(catchError(err => this.errorHandler.handleError(err)));
  }

  modifyModuleAccess(moduleAccess: ModuleAccessModifyDto): Observable<ResponseModel<ModuleAccessResponseDto>> {
    return this.http.put<ResponseModel<ModuleAccessResponseDto>>(`${this.apiUrl}/modify-module-access`, moduleAccess)
      .pipe(catchError(err => this.errorHandler.handleError(err)));
  }

  removeModuleAccess(id: number) {
    const params = new HttpParams().set('id', id.toString());
    return this.http.delete<ResponseModel<object>>(`${this.apiUrl}/remove-module-access`, { params })
      .pipe(catchError(err => this.errorHandler.handleError(err)));
  }
  //#endregion Module Access
}