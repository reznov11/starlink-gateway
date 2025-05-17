import {Component} from '@angular/core';
import {DynamicTableComponent, TableColumn} from '@components/dynamic-table/dynamic-table.component';
import {PageEvent} from '@angular/material/paginator';
import {FormConstructor} from '@pages/forms-constructor/interfaces';
import {HeaderActionService} from '@services/header-action.service';
import {generateFormConstructor} from '@pages/forms-constructor/data';
import { CreateFormComponent } from './create-form/create-form.component';
import { ConfirmationDialogComponent } from '@app/components/confirmation-dialog/confirmation-dialog.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import { FormService } from '@app/services/api/form';

// Generate 100 records
const FORMS: any[] = Array.from({ length: 100 }, () => generateFormConstructor());

@Component({
  selector: 'app-forms-constructor',
  imports: [
    DynamicTableComponent
  ],
  templateUrl: './forms-constructor.component.html',
  styleUrl: './forms-constructor.component.scss'
})
export class FormsConstructorComponent {
  private dialogSettings: MatDialogConfig = {
    height: 'auto',
    width: '700px',
    disableClose: true
  }
  public formConstructorColumns: TableColumn[] = [
    { key: 'title', header: 'Название' },
    { key: 'partner', header: 'Интеграция', type: 'partner' },
    { key: 'created_at', header: 'Дата создания', type: 'date' },
    { key: 'components_total', header: 'Количество блоков' },
    { key: 'user', header: 'Создал форму', type: 'user' },
  ];

  public forms: FormConstructor[] = FORMS;
  public displayedForms: FormConstructor[] = [];

  public pageSize= 10;
  public currentPage = 0;
  public readonly totalItems = this.forms.length;
  public readonly pageSizeOptions = [5, 8, 15, 25];

  constructor(
    private headerService: HeaderActionService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private formService: FormService
  ) {
    this.headerService.setComponent(
      CreateFormComponent, 
      'Создать форму',
      async () => {
        await this.getFormsList();
      }
    );
  }

  async ngOnInit() {
    await this.getFormsList();
  }

  async onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    await this.getFormsList();
  }

  private async getFormsList() {
    (await this.formService.getForms()).subscribe(({
      next: (forms: FormConstructor[]) => {
        this.forms = forms;

        const startIndex = this.currentPage * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        this.displayedForms = this.forms.slice(startIndex, endIndex);
      },
      error: (error: any) => {
        console.error(error);
        this.snackBar.open('Ошибка при получении форм', 'Закрыть', {
          duration: 3000,
          verticalPosition: 'top',
        });
      }
    }));
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  public handleAction(event: {action: string, item: any}) {
    switch(event.action) {
      case 'edit':
        this.editForm(event.item);
        break;
      case 'delete':
        this.deleteForm(event.item);
        break;
    }
  }

  public editForm(form: FormConstructor) {
    this.router.navigate([`/dashboard/constructor/edit`, form.id]);
  }

  public deleteForm(form: FormConstructor) {
    const dialogRef = this.dialog.open(
      ConfirmationDialogComponent,
      {
        ...this.dialogSettings,
        data: {
          title: `Удалить форму "${form.title}"?`,
          message: 'Вы уверены, что хотите удалить форму?',
          confirmText: 'Удалить',
          cancelText: 'Отменить'
        }
      }
    );

    dialogRef.afterClosed().subscribe(async (result: boolean) => {
      if (result) {
        (await this.formService.deleteForm(form.id)).subscribe(({
          next: async () => {
            this.snackBar.open('Форма удалена', 'Закрыть', {
              duration: 3000,
              verticalPosition: 'top',
            });
            await this.getFormsList();
          },
          error: (error: any) => {
            console.error(error);
            this.snackBar.open('Ошибка при удалении формы', 'Закрыть', {
              duration: 3000,
              verticalPosition: 'top',
            });
          }
        }));
      }
    });
  }
}
