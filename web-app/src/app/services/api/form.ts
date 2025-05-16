import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {FormConstructor} from '@pages/forms-constructor/interfaces';

@Injectable({
  providedIn: 'root'
})
export class FormService {
  private apiUrl = `/authorize/forms/`;

  constructor(private http: HttpClient) { }

  public async createForm(formData: FormConstructor): Promise<Observable<FormConstructor>> {
    return this.http.post<FormConstructor>(this.apiUrl, formData);
  }

  public async getForms(): Promise<Observable<FormConstructor[]>> {
    return this.http.get<FormConstructor[]>(this.apiUrl);
  }

  public async getFormById(formId: string): Promise<Observable<FormConstructor>> {
    return this.http.get<FormConstructor>(`${this.apiUrl}/${formId}/`);
  }

  public async updateForm(formId: string, formData: FormConstructor): Promise<Observable<FormConstructor>> {
    return this.http.patch<FormConstructor>(`${this.apiUrl}/${formId}/`, formData);
  }

  public async deleteForm(formId: string): Promise<Observable<void>> {
    return this.http.delete<void>(`${this.apiUrl}/${formId}/`);
  }
}
