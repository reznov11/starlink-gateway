import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Partner} from '@pages/forms-constructor/interfaces';

@Injectable({
  providedIn: 'root'
})
export class PartnerService {
  private apiUrl = `/authorize/partners/`;

  constructor(private http: HttpClient) { }

  public async createPartner(partnerData: Partner): Promise<Observable<Partner>> {
    return this.http.post<Partner>(this.apiUrl, partnerData);
  }

  public async getPartners(): Promise<Observable<Partner[]>> {
    return this.http.get<Partner[]>(this.apiUrl);
  }

  public async getPartnerById(partnerId: string): Promise<Observable<Partner>> {
    return this.http.get<Partner>(`${this.apiUrl}/${partnerId}/`);
  }

  public async updatePartner(partnerId: string, partnerData: Partner): Promise<Observable<Partner>> {
    return this.http.patch<Partner>(`${this.apiUrl}/${partnerId}/`, partnerData);
  }

  public async deletePartner(partnerId: string): Promise<Observable<void>> {
    return this.http.delete<void>(`${this.apiUrl}/${partnerId}/`);
  }
}
