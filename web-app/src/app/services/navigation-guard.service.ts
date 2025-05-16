import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LayoutService } from './sidebar-layout.service';
import { Router } from '@angular/router';
import {ConfirmationDialogComponent} from '@components/confirmation-dialog/confirmation-dialog.component';
@Injectable({ providedIn: 'root' })
export class NavigationGuardService {
    public shouldConfirm = false;

    constructor(
        private dialog: MatDialog,
        private router: Router,
        private layoutService: LayoutService
    ) { }

    public async enableGuard() {
        this.shouldConfirm = true;
        this.layoutService.toggleLessonMode(true);
        history.pushState(null, '', location.href);
        window.addEventListener('popstate', this.blockBackNavigation);
    }

    public async disableGuard() {
        this.shouldConfirm = false;
        this.layoutService.toggleLessonMode(false);
        window.removeEventListener('popstate', this.blockBackNavigation);
    }

    private blockBackNavigation = async (event: PopStateEvent) => {
        if (this.shouldConfirm) {
            history.pushState(null, '', location.href);
            await this.confirmNavigation().then(confirmed => {
                if (confirmed) {
                    this.disableGuard();
                    this.router.navigateByUrl(event.state?.url || '/');
                }
            });
        }
    }

    public async confirmNavigation(): Promise<boolean> {
        if (!this.shouldConfirm) return true;

        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {
                title: 'Вы уверены, что хотите покинуть урок?',
                message: 'Ваш прогресс будет сохранен. Вы уверены, что хотите покинуть урок?',
                confirmText: 'Выйти',
                cancelText: 'Остаться'
            },
            disableClose: true
        });

        return await dialogRef.afterClosed().toPromise();
    }
}
