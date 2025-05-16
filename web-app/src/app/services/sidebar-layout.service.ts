import { Injectable } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Injectable({ providedIn: 'root' })
export class LayoutService {
    public sidenav!: MatSidenav;

    public setSidenav(sidenav: MatSidenav) {
        this.sidenav = sidenav;
    }

    public toggleLessonMode(enable: boolean) {
        if (enable) {
            this.sidenav?.close();
        } else {
            this.sidenav?.open();
        }
    }
}