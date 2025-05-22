import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class IconsRegistryService {
  constructor(
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) {}

  registerIcons(): void {
    this.iconRegistry
      .addSvgIcon(
        'custom_edit',
        this.sanitizer.bypassSecurityTrustResourceUrl('/assets/tables/edit.svg')
      )
      .addSvgIcon(
        'custom_delete',
        this.sanitizer.bypassSecurityTrustResourceUrl('/assets/tables/delete.svg')
      )
      .addSvgIcon(
        'custom_add',
        this.sanitizer.bypassSecurityTrustResourceUrl('/assets/tables/add.svg')
      )
      .addSvgIcon(
        'custom_code',
        this.sanitizer.bypassSecurityTrustResourceUrl('/assets/tables/code.svg')
      )
      .addSvgIcon(
        'custom_calendar',
        this.sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/calendar.svg')
      )
      .addSvgIcon(
        'custom_search',
        this.sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/search.svg')
      )
      .addSvgIcon(
        'custom_filter',
        this.sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/filter.svg')
      )
      .addSvgIcon(
        'custom_sort',
        this.sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/sort.svg')
      )
      .addSvgIcon(
        'custom_close',
        this.sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/close.svg')
      )
      .addSvgIcon(
        'custom_dropzone_add',
        this.sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/dropzone_add.svg')
      )
      .addSvgIcon(
        'custom_drag_indicator',
        this.sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/drag_indicator.svg')
      )
      .addSvgIcon(
        'custom_preview',
        this.sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/preview.svg')
      )
      .addSvgIcon(
        'custom_lock',
        this.sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/lock.svg')
      )
      .addSvgIcon(
        'custom_constructor',
        this.sanitizer.bypassSecurityTrustResourceUrl('/assets/nav-icons/constructor.svg')
      )
      .addSvgIcon(
        'custom_employees',
        this.sanitizer.bypassSecurityTrustResourceUrl('/assets/nav-icons/employees.svg')
      )
      .addSvgIcon(
        'custom_globe',
        this.sanitizer.bypassSecurityTrustResourceUrl('/assets/nav-icons/globe.svg')
      )
      .addSvgIcon(
        'custom_companies',
        this.sanitizer.bypassSecurityTrustResourceUrl('/assets/nav-icons/companies.svg')
      );
  }
}
