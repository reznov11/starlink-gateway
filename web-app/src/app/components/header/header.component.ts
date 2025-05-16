import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService, UserProfile } from '@app/services/auth.service';
import { UserRole, UserRoleReadable } from '@guards/role.guard';
import { Title } from '@angular/platform-browser';
import { HeaderActionService } from '@services/header-action.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CreateFormComponent } from '@app/pages/forms-constructor/create-form/create-form.component';
import { RouteTitleService } from '@app/services/route-title.service';
import { Subscription } from 'rxjs';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    RouterModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public pageTitle: string = 'Страница';
  public userProfile: UserProfile = {} as UserProfile;
  readonly dialog = inject(MatDialog);

  private titleSubscription!: Subscription;

  private dialogSettings: MatDialogConfig = {
    height: 'auto',
    width: '700px',
    disableClose: true
  }

  constructor(
    private titleService: Title,
    public router: Router,
    private activatedRoute: ActivatedRoute,
    public headerService: HeaderActionService,
    private routeTitleService: RouteTitleService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.routeTitleService.initialize();

    this.titleSubscription = this.routeTitleService.title$.subscribe(title => {
      this.pageTitle = title;
    });
  }

  ngOnDestroy(): void {
    if (this.titleSubscription) {
      this.titleSubscription.unsubscribe();
    }
  }

  public setTitleFromRoute(route: ActivatedRoute): void {
    let title = this.getTitle(route);
    if (title) {
      this.titleService.setTitle(title);
      this.pageTitle = title;
    }
  }

  private getTitle(route: ActivatedRoute): string | null {
    if (route.snapshot.data && route.snapshot.data['title']) {
      return route.snapshot.data['title'];
    }

    if (route.firstChild) {
      return this.getTitle(route.firstChild);
    }

    return null;
  }

  public get getRole(): string {
    return UserRoleReadable[this.userProfile?.role || UserRole.UNKNOWN];
  }

  public async openComponent() {
    if (
      this.headerService.currentComponent === CreateFormComponent
    ) {
      await this.router.navigate(
        ['/dashboard/constructor/create'],
        { relativeTo: this.activatedRoute }
      );
      return;
    }

    const dialogRef = this.dialog.open(this.headerService.currentComponent!, this.dialogSettings);

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        this.headerService.executeAfterCloseCallback();
        this.snackBar.open('Список успешно обновлен', 'Закрыть', {
          duration: 3000,
          verticalPosition: 'top',
        });
      }
    });
  }

  public get isProfilePage(): boolean {
    return this.router.url.includes('profile');
  }

  public get isFormConstructor(): boolean {
    return this.router.url.includes('/constructor/create') ||
      this.router.url.includes('/constructor/edit');
  }

  public logout() {
    const dialogRef = this.dialog.open(
      ConfirmationDialogComponent,
      {
        ...this.dialogSettings,
        data: {
          title: `Выход из профиля`,
          message: 'Вы уверены, что хотите выйти из профиля??',
          confirmText: 'Да, выйти',
          cancelText: 'Отменить'
        }
      }
    );

    dialogRef.afterClosed().subscribe(async (result: boolean) => {
      if (result) {
        this.authService.logout().subscribe({
          next: (response: HttpResponse<any>) => {
            if (response.status === 205) {
              this.handleSuccessfulLogout();
            } else {
              this.handleFailedLogout(`Unexpected status code: ${response.status}`);
            }
          },
          error: (err) => {
            if (err.status === 205) {
              this.handleSuccessfulLogout();
            } else {
              this.handleFailedLogout(err.message || 'Logout failed');
            }
          }
        });
      }
    });
  }

  private async handleSuccessfulLogout(): Promise<void> {
    this.authService.cleanToken();
    this.snackBar.open('Вы вышли из системы', 'Закрыть', {
      duration: 3000,
      verticalPosition: 'top',
    });
    await this.router.navigate(['/login']);
  }

  private async handleFailedLogout(errorMessage: string): Promise<void> {
    console.error('Logout error:', errorMessage);
    this.snackBar.open('Не удалось выйти из системы', 'Закрыть', {
      duration: 3000,
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
    await this.router.navigate([this.router.url]);
  }
}
