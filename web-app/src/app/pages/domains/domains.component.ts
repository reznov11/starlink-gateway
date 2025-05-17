import {Component} from '@angular/core';
import {DynamicTableComponent, TableColumn} from '@components/dynamic-table/dynamic-table.component';
import {PageEvent} from '@angular/material/paginator';
import {HeaderActionService} from '@services/header-action.service';
import { ConfirmationDialogComponent } from '@app/components/confirmation-dialog/confirmation-dialog.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {Domain} from '@pages/forms-constructor/interfaces';
import {CreateDomainComponent} from '@pages/domains/create-domain/create-domain.component';
import {DomainService} from '@app/services/api/domain';

@Component({
  selector: 'app-domains-constructor',
  imports: [
    DynamicTableComponent
  ],
  templateUrl: './domains.component.html',
  styleUrl: './domains.component.scss'
})
export class DomainsComponent {
  private dialogSettings: MatDialogConfig = {
    height: 'auto',
    width: '700px',
    disableClose: true
  }
  public domainColumns: TableColumn[] = [
    { key: 'partner', header: 'Партнер', type: 'partner' },
    { key: 'code', header: 'Код' },
    { key: 'url', header: 'Ссылка' },
    { key: 'status', header: 'Статус', type: 'active_status' },

  ];

  public domains: Domain[] = [];
  public displayedDomains: Domain[] = [];

  public pageSize= 10;
  public currentPage = 0;
  public readonly totalItems = this.domains.length;
  public readonly pageSizeOptions = [5, 8, 15, 25];

  constructor(
    private headerService: HeaderActionService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private domainService: DomainService
  ) {
    this.headerService.setComponent(
      CreateDomainComponent,
      'Новый домен',
      async () => await this.getDomains()
    );
  }

  async ngOnInit() {
    await this.getDomains();
  }

  async onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    await this.getDomains();
  }

  private async getDomains() {
    (await this.domainService.getDomainsList()).subscribe({
      next: (domains: Domain[]) => {
        console.log('Domains', domains);
        this.domains = domains;

        const startIndex = this.currentPage * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        this.displayedDomains = this.domains.slice(startIndex, endIndex);
      },
      error: (err: any) => {
        this.snackBar.open('Ошибка при получении доменов', 'Закрыть', {
          duration: 3000,
          verticalPosition: 'top',
        });
      }
    });
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

  public editForm(domain: Domain) {
    const dialogRef = this.dialog.open(
      CreateDomainComponent,
      {
        ...this.dialogSettings,
        data: {
          domain: domain
        }
      }
    );

    dialogRef.afterClosed().subscribe(async (result: Domain) => {
      if (result) {
        console.log('Edit domain', result);
        this.domains = this.domains.map(d => d.id === domain.id ? result : d);
        this.getDomains();
        this.snackBar.open('Домен обновлен', 'Закрыть', {
          duration: 3000,
          verticalPosition: 'top',
        });
      }
    });
  }

  public deleteForm(domain: Domain) {
    const dialogRef = this.dialog.open(
      ConfirmationDialogComponent,
      {
        ...this.dialogSettings,
        data: {
          title: `Удалить компанию "${domain.url}"?`,
          message: 'Вы уверены, что хотите удалить домена?',
          confirmText: 'Удалить',
          cancelText: 'Отменить'
        }
      }
    );

    dialogRef.afterClosed().subscribe(async (result: boolean) => {
      if (result) {
        (await this.domainService.deleteDomain(domain.id)).subscribe({
          next: () => {
            this.getDomains();
            this.snackBar.open('Домен удален', 'Закрыть', {
              duration: 3000,
              verticalPosition: 'top',
            });
          },
          error: (err: any) => {
            this.snackBar.open('Ошибка при удалении домена', 'Закрыть', {
              duration: 3000,
              verticalPosition: 'top',
            });
          }
        });
      }
    });
  }
}
