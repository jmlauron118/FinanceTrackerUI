import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { UserResponseDTO } from '@interfaces/usermanager/users-dto/user-response-dto';
import { UserRequestDTO } from '@interfaces/usermanager/users-dto/user-request-dto';
import { UserModifyDTO } from '@interfaces/usermanager/users-dto/user-modify-dto';
import { ErrorHandlerService } from '@services/error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class UsermanagerService {
  private readonly apiUrl = '/api/usermanager'

  constructor(private http: HttpClient, private errorHandler: ErrorHandlerService) { }

  getAllUsers(): Observable<UserResponseDTO[]> {
    return this.http.get<UserResponseDTO[]>(`${this.apiUrl}/get-all-users`)
      .pipe(catchError(err => this.errorHandler.handleError(err)));
  }

  getUserById(id: number): Observable<UserResponseDTO> {
    return this.http.get<UserResponseDTO>(`${this.apiUrl}/get-user-by-id/${id}`)
      .pipe(catchError(err => this.errorHandler.handleError(err)));
  }

  addUser(user: UserRequestDTO): Observable<UserResponseDTO> {
    return this.http.post<UserResponseDTO>(`${this.apiUrl}/add-user`, user)
      .pipe(catchError(err => this.errorHandler.handleError(err)));
  }

  modifyUser(user: UserModifyDTO): Observable<UserResponseDTO> {
    return this.http.put<UserResponseDTO>(`${this.apiUrl}/modify-user`, user)
      .pipe(catchError(err => this.errorHandler.handleError(err)));
  }
}
