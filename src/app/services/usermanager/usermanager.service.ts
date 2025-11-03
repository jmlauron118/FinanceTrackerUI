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
import { UserModules } from '@interfaces/usermanager/user-modules';

@Injectable({
  providedIn: 'root'
})
export class UsermanagerService {
  private readonly apiUrl = '/api/usermanager'

  constructor(private http: HttpClient, private errorHandler: ErrorHandlerService) { }

  //#region users
  getAllUsers(status: number = 2): Observable<UserResponseDto[]> {
    const params = new HttpParams().set('status', status.toString());
    return this.http.get<UserResponseDto[]>(`${this.apiUrl}/get-all-users`, { params })
      .pipe(catchError(err => this.errorHandler.handleError(err)));
  }

  getUserById(id: number): Observable<UserResponseDto> {
    return this.http.get<UserResponseDto>(`${this.apiUrl}/get-user-by-id/${id}`)
      .pipe(catchError(err => this.errorHandler.handleError(err)));
  }

  addUser(user: UserRequestDto): Observable<UserResponseDto> {
    return this.http.post<UserResponseDto>(`${this.apiUrl}/add-user`, user)
      .pipe(catchError(err => this.errorHandler.handleError(err)));
  }

  modifyUser(user: UserModifyDto): Observable<UserResponseDto> {
    return this.http.put<UserResponseDto>(`${this.apiUrl}/modify-user`, user)
      .pipe(catchError(err => this.errorHandler.handleError(err)));
  }
  //#endregion Users

  //#region Roles 
  getAllRoles(status: number = 2): Observable<RoleResponseDto[]> {
    const params = new HttpParams().set('status', status.toString());
    return this.http.get<RoleResponseDto[]> (`${this.apiUrl}/get-all-roles`, { params })
      .pipe(catchError(err => this.errorHandler.handleError(err)));
  }

  addRole(role: RoleRequestDto): Observable<RoleResponseDto> {
    return this.http.post<RoleResponseDto>(`${this.apiUrl}/add-role`, role)
      .pipe(catchError(err => this.errorHandler.handleError(err)));
  }

  modifyRole(role: RoleModifyDto): Observable<RoleResponseDto> {
    return this.http.put<RoleResponseDto>(`${this.apiUrl}/modify-role`, role)
      .pipe(catchError(err => this.errorHandler.handleError(err)));
  }
  //#endregion Roles

  //#region Modules
  getAllModules(status: number = 2): Observable<ModuleResponseDto[]> {
    const params = new HttpParams().set('status', status.toString());
    return this.http.get<ModuleResponseDto[]>(`${this.apiUrl}/get-all-modules`, { params })
      .pipe(catchError(err => this.errorHandler.handleError(err)));
  }

  addModule(module: ModuleRequestDto): Observable<ModuleResponseDto> {
    return this.http.post<ModuleResponseDto>(`${this.apiUrl}/add-module`, module)
      .pipe(catchError(err => this.errorHandler.handleError(err)));
  }

  modifyModule(module: ModuleModifyDto): Observable<ModuleResponseDto> {
    return this.http.put<ModuleResponseDto>(`${this.apiUrl}/modify-module`, module)
      .pipe(catchError(err => this.errorHandler.handleError(err)));
  }
  //#endregion Modules

  //#region Actions
  getAllActions(status: number = 2): Observable<ActionResponseDto[]> {
    const params = new HttpParams().set('status', status.toString());
    return this.http.get<ActionResponseDto[]>(`${this.apiUrl}/get-all-actions`, { params })
      .pipe(catchError(err => this.errorHandler.handleError(err)));
  }

  addAction(action: ActionRequestDto): Observable<ActionResponseDto> {
    return this.http.post<ActionResponseDto>(`${this.apiUrl}/add-action`, action)
      .pipe(catchError(err => this.errorHandler.handleError(err)));
  }

  modifyAction(action: ActionModifyDto): Observable<ActionResponseDto> {
    return this.http.put<ActionResponseDto>(`${this.apiUrl}/modify-action`, action)
      .pipe(catchError(err => this.errorHandler.handleError(err)));
  }
  //#endregion Actions

  //#region Module Actions
  getAllModuleActions(): Observable<ModuleActionResponseDto[]> {
    return this.http.get<ModuleActionResponseDto[]>(`${this.apiUrl}/get-all-module-actions`)
      .pipe(catchError(err => this.errorHandler.handleError(err)));
  }

  addModuleAction(moduleAction: ModuleActionRequestDto): Observable<ModuleActionResponseDto> {
    return this.http.post<ModuleActionResponseDto>(`${this.apiUrl}/add-module-action`, moduleAction)
      .pipe(catchError(err => this.errorHandler.handleError(err)));
  }

  modifyModuleAction(moduleAction: ModuleActionModifyDto): Observable<ModuleActionResponseDto> {
    return this.http.put<ModuleActionResponseDto>(`${this.apiUrl}/modify-module-action`, moduleAction)
      .pipe(catchError(err => this.errorHandler.handleError(err)));
  }
  
  removeModuleAction(id: number) {
    const params = new HttpParams().set('id', id.toString());
    return this.http.delete(`${this.apiUrl}/remove-module-action`, { params })
      .pipe(catchError(err => this.errorHandler.handleError(err)));
  }
  //#endregion Module Actions

  //#region User Roles
  getAllUserRoles(): Observable<UserRoleResponseDto[]> {
    return this.http.get<UserRoleResponseDto[]>(`${this.apiUrl}/get-all-user-roles`)
      .pipe(catchError(err => this.errorHandler.handleError(err)));
  }

  addUserRole(userRole: UserRoleRequestDto): Observable<UserRoleResponseDto> {
    return this.http.post<UserRoleResponseDto>(`${this.apiUrl}/add-user-role`, userRole)
      .pipe(catchError(err => this.errorHandler.handleError(err)));
  }
  
  modifyUserRole(userRole: UserRoleModifyDto): Observable<UserRoleResponseDto> {
    return this.http.put<UserRoleResponseDto>(`${this.apiUrl}/modify-user-role`, userRole)
      .pipe(catchError(err => this.errorHandler.handleError(err)));
  }

  removeUserRole(id: number) {
    const params = new HttpParams().set('id', id.toString());
    return this.http.delete(`${this.apiUrl}/remove-user-role`, { params })
      .pipe(catchError(err => this.errorHandler.handleError(err)));
  }
  //#endregion User Roles
  
  //#region Module Access
  getAllModuleAccess(): Observable<ModuleAccessResponseDto[]> {
    return this.http.get<ModuleAccessResponseDto[]>(`${this.apiUrl}/get-all-module-access`)
      .pipe(catchError(err => this.errorHandler.handleError(err)));
  }

  addModuleAccess(moduleAccess: ModuleAccessRequestDto): Observable<ModuleAccessResponseDto> {
    return this.http.post<ModuleAccessResponseDto>(`${this.apiUrl}/add-module-access`, moduleAccess)
      .pipe(catchError(err => this.errorHandler.handleError(err)));
  }

  modifyModuleAccess(moduleAccess: ModuleAccessModifyDto): Observable<ModuleAccessResponseDto> {
    return this.http.put<ModuleAccessResponseDto>(`${this.apiUrl}/modify-module-access`, moduleAccess)
      .pipe(catchError(err => this.errorHandler.handleError(err)));
  }

  removeModuleAccess(id: number) {
    const params = new HttpParams().set('id', id.toString());
    return this.http.delete(`${this.apiUrl}/remove-module-access`, { params })
      .pipe(catchError(err => this.errorHandler.handleError(err)));
  }
  //#endregion Module Access
}