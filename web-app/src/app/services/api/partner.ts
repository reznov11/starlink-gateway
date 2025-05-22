import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import {FormConstructor, Partner} from '@pages/forms-constructor/interfaces';
import { UUIDTypes } from 'uuid';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PartnerService {
  public apiUrl = `/partners`;

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

  public async getPartnerByDomainCode(domainCode: string): Promise<Observable<HttpResponse<FormConstructor>>> {
    return this.http.get<FormConstructor>(`${this.apiUrl}/portal/?ifr_code=${domainCode}`,{
      observe: 'response'
    }).pipe(
      tap((response: HttpResponse<FormConstructor>) => {
        console.log('Status Code:', response.status);
        console.log('Data:', response.body);
      })
    );
  }
}
