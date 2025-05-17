import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Domain } from '@pages/forms-constructor/interfaces';
import { UUIDTypes } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class DomainService {
  private apiUrl = `/domains`;

  constructor(private http: HttpClient) { }

  public async createDomain(domainData: Partial<Domain>): Promise<Observable<Domain>> {
    return this.http.post<Domain>(`${this.apiUrl}/create/`, domainData);
  }

  public async getDomainsList(): Promise<Observable<Domain[]>> {
    return this.http.get<Domain[]>(this.apiUrl);
  }

  public async getDomainById(domainId: UUIDTypes): Promise<Observable<Domain>> {
    return this.http.get<Domain>(`${this.apiUrl}/${domainId}/`);
  }

  public async updateDomain(domainId: UUIDTypes, domainData: Partial<Domain>): Promise<Observable<Domain>> {
    return this.http.patch<Domain>(`${this.apiUrl}/${domainId}/update/`, domainData);
  }

  public async deleteDomain(domainId: UUIDTypes): Promise<Observable<void>> {
    return this.http.delete<void>(`${this.apiUrl}/${domainId}/delete/`);
  }
}
