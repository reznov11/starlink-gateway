import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Partner} from '@pages/forms-constructor/interfaces';
import { UUIDTypes } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class PartnerService {
  private apiUrl = `/partners`;

  constructor(private http: HttpClient) { }

  public async createPartner(partnerData: Partner): Promise<Observable<Partner>> {
    return this.http.post<Partner>(`${this.apiUrl}/create/`, partnerData);
  }

  public async getPartners(): Promise<Observable<Partner[]>> {
    return this.http.get<Partner[]>(`${this.apiUrl}/`);
  }

  public async getPartnerById(partnerId: UUIDTypes): Promise<Observable<Partner>> {
    return this.http.get<Partner>(`${this.apiUrl}/${partnerId}/`);
  }

  public async updatePartner(partnerId: UUIDTypes, partnerData: Partner): Promise<Observable<Partner>> {
    return this.http.patch<Partner>(`${this.apiUrl}/${partnerId}/update/`, partnerData);
  }

  public async deletePartner(partnerId: UUIDTypes): Promise<Observable<void>> {
    return this.http.delete<void>(`${this.apiUrl}/${partnerId}/delete/`);
  }
}
