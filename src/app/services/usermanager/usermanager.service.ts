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
}