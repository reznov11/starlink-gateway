import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EnumService {
  enums: { [key: string]: any } = {};

  getEnum(name: string): any {
    return this.enums[name];
  }
}
