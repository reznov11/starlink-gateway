import {Component, OnInit} from '@angular/core';
import {PageEvent} from '@angular/material/paginator';
import {UserProfile} from '@services/auth.service';
import {DynamicTableComponent, TableColumn} from '@components/dynamic-table/dynamic-table.component';
import {HeaderActionService} from '@services/header-action.service';
import { CreateUserComponent } from './modals/create-user/create-user.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '@app/components/confirmation-dialog/confirmation-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import {UserService} from '@services/api/user';

@Component({
  selector: 'app-user-list',
  imports: [
    DynamicTableComponent
  ],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss'
})
export class UsersListComponent implements OnInit{
  private dialogSettings: MatDialogConfig = {
    height: 'auto',
    width: '700px',
    disableClose: true
  }
  public userColumns: TableColumn[] = [
    { key: 'id', header: 'ID' },
    { key: 'fullname', header: 'ФИО' },
    { key: 'job_title', header: 'Должность' },
    { key: 'email', header: 'Почта' },
    { key: 'phone_number', header: 'Телефон' },
    { key: 'role', header: 'Права' },
    { key: 'is_active', header: 'Активный', type: 'boolean' },
  ];

  public users: UserProfile[] = [];
  public displayedUsers: UserProfile[] = [];

  public pageSize= 10;
  public currentPage = 0;
  public readonly totalItems = this.users.length;
  public readonly pageSizeOptions = [5, 8, 15, 25];

  constructor(
    private headerService: HeaderActionService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private userService: UserService
  ) {
    this.headerService.setComponent(
      CreateUserComponent,
      'Добавить сотрудника',
      async () => await this.getUsersList()
    )
  }

  async ngOnInit() {
    await this.getUsersList();
  }

  public async onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    await this.getUsersList();
  }

  private async getUsersList() {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    (
      await this.userService.getUsers()
    ).subscribe({
      next: (users: UserProfile[]) => {
        this.users = users;
        this.displayedUsers = this.users.slice(startIndex, endIndex);
      },
      error: (err: any) => {
        console.log('Error while adding a new user', err);
      }
    })
  }

  public get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  public handleAction(event: {action: string, item: any}) {
    switch(event.action) {
      case 'edit':
        this.editUser(event.item);
        break;
      case 'delete':
        this.deleteUser(event.item);
        break;
    }
  }

  public editUser(user: UserProfile) {
    const dialogRef = this.dialog.open(
      CreateUserComponent,
      {
        ...this.dialogSettings,
        data: {
          user: user
        }
      }
    );

    dialogRef.afterClosed().subscribe(async (result: UserProfile) => {
      if (result) {
        this.snackBar.open('Сотрудник обновлен', 'Закрыть', {
          duration: 3000,
          verticalPosition: 'top',
        });
        await this.getUsersList();
      }
    });
  }

  public deleteUser(user: UserProfile) {
    const dialogRef = this.dialog.open(
      ConfirmationDialogComponent,
      {
        ...this.dialogSettings,
        data: {
          title: `Удалить сотрудника "${user.fullname}"?`,
          message: 'Вы уверены, что хотите удалить сотрудника?',
          confirmText: 'Удалить',
          cancelText: 'Отменить'
        }
      }
    );

    dialogRef.afterClosed().subscribe(async (result: boolean) => {
      if (result) {
        (
          await this.userService.deleteUser(user.id)
        ).subscribe({
          next: async () => {
            this.snackBar.open('Сотрудник удален', 'Закрыть', {
              duration: 3000,
              verticalPosition: 'top',
            });
            await this.getUsersList();
          },
          error: (err: any) => {
            console.log('Error while deleting user', err);
          }
        })
        // TODO: send request to delete user
      }
    });
  }
}
