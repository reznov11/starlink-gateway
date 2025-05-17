import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {FormConstructor} from '@pages/forms-constructor/interfaces';
import { UUIDTypes } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class FormService {
  private apiUrl = `/constructor`;

  constructor(private http: HttpClient) { }

  public async createForm(formData: FormConstructor): Promise<Observable<FormConstructor>> {
    return this.http.post<FormConstructor>(`${this.apiUrl}/create/`, formData);
  }

  public async getForms(): Promise<Observable<FormConstructor[]>> {
    return this.http.get<FormConstructor[]>(`${this.apiUrl}/`);
  }

  public async getFormById(formId: UUIDTypes): Promise<Observable<FormConstructor>> {
    return this.http.get<FormConstructor>(`${this.apiUrl}/${formId}/`);
  }

  public async updateForm(formId: UUIDTypes, formData: FormConstructor): Promise<Observable<FormConstructor>> {
    return this.http.patch<FormConstructor>(`${this.apiUrl}/${formId}/update/`, formData);
  }

  public async deleteForm(formId: UUIDTypes): Promise<Observable<void>> {
    return this.http.delete<void>(`${this.apiUrl}/${formId}/delete/`);
  }
}
