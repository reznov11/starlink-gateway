import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import {NavigationGuardService} from '@services/navigation-guard.service';

@Injectable({
    providedIn: 'root'
})
export class canDeactivateGuard implements CanDeactivate<any> {

    constructor(private navGuard: NavigationGuardService) { }

    canDeactivate(
        component: any
    ): Observable<boolean> | Promise<boolean> | boolean {
        return this.navGuard.confirmNavigation();
    }
}
