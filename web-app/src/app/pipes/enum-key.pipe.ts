import { Pipe, PipeTransform } from '@angular/core';
import {EnumService} from '../services/enums.service';

@Pipe({
  name: 'enumKey',
})
export class EnumKeyPipe implements PipeTransform {
  constructor(private enumService: EnumService) {}

  transform(value: string, enumName: string): string {
    const enumType = this.enumService.getEnum(enumName);

    if (!enumType) {
      console.error(`Enum '${enumName}' not found.`);
      return value;
    }

    for (const key in enumType) {
      if (enumType[key] === value) {
        return key;
      }
    }

    return value;
  }
}
