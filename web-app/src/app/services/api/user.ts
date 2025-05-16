import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {UserProfile} from '@services/auth.service';
import {UUIDTypes} from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `/user/`;

  constructor(private http: HttpClient) { }

  public async createUser(userData: FormData): Promise<Observable<UserProfile>> {
    return this.http.post<UserProfile>(this.apiUrl, userData);
  }

  public async getUsers(): Promise<Observable<UserProfile[]>> {
    return this.http.get<UserProfile[]>(`${this.apiUrl}`);
  }

  public async getUserRoles(): Promise<Observable<void[]>> {
    return this.http.get<void[]>(`${this.apiUrl}roles/`);
  }

  public async getUserById(userId: string): Promise<Observable<UserProfile>> {
    return this.http.get<UserProfile>(`${this.apiUrl}${userId}/`);
  }

  public async updateUser(userId: UUIDTypes, userData: FormData): Promise<Observable<UserProfile>> {
    return this.http.put<UserProfile>(`${this.apiUrl}${userId}/`, userData);
  }

  public async deleteUser(userId: UUIDTypes): Promise<Observable<void>> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${userId}/`);
  }
}
