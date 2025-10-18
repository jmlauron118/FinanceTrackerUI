import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserResponseDTO } from '@interfaces/usermanager/users-dto/user-response-dto';
import { UserRequestDTO } from '@interfaces/usermanager/users-dto/user-request-dto';
import { UserModifyDTO } from '@interfaces/usermanager/users-dto/user-modify-dto';

@Injectable({
  providedIn: 'root'
})
export class UsermanagerService {
  private readonly apiUrl = '/api/usermanager'

  constructor(private http: HttpClient) { }

  getAllUsers(): Observable<UserResponseDTO[]> {
    return this.http.get<UserResponseDTO[]>(`${this.apiUrl}/get-all-users`);
  }

  getUserById(id: number): Observable<UserResponseDTO> {
    return this.http.get<UserResponseDTO>(`${this.apiUrl}/get-user-by-id/${id}`);
  }

  addUser(user: UserRequestDTO): Observable<UserResponseDTO> {
    return this.http.post<UserResponseDTO>(`${this.apiUrl}/add-user`, user);
  }

  modifyUser(user: UserModifyDTO): Observable<UserResponseDTO> {
    return this.http.put<UserResponseDTO>(`${this.apiUrl}/modify-user`, user);
  }
}
