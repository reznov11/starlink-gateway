import {Component} from '@angular/core';
import {DynamicTableComponent, TableColumn} from '@components/dynamic-table/dynamic-table.component';
import {PageEvent} from '@angular/material/paginator';
import {Domain, DomainStatus, Partner} from '@pages/forms-constructor/interfaces';
import { faker } from '@faker-js/faker';
import {HeaderActionService} from '@services/header-action.service';
import {CreatePartnerComponent} from '@pages/partners/modals/create-partner/create.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '@app/components/confirmation-dialog/confirmation-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

function generateDomain(partner: Partner): Domain {
  return {
    id: faker.string.uuid(),
    partner: partner,
    code: faker.string.alphanumeric(10),
    url: faker.internet.url(),
    status: faker.helpers.arrayElement(['ACTIVE', 'NOT_ACTIVE']) as DomainStatus,
  };
}

function generatePartner(): Partner {
  const partner: Partner = {
    id: faker.string.uuid(),
    name: faker.company.name(),
    login: faker.internet.userName(),
    phone_number: faker.phone.number(),
    email: faker.internet.email(),
    domain: {} as Domain,
    logo: faker.image.avatar(),
    person_contact: faker.name.fullName(),
    category: faker.commerce.department(),
    inn: faker.string.numeric(14),
    is_active: faker.datatype.boolean(),
    created_at: faker.date.future()
  };

  partner.domain = generateDomain(partner);

  return partner;
}

const PARTNERS: Partner[] = Array.from({ length: 100 }, () => generatePartner());

@Component({
  selector: 'app-partners',
  imports: [
    DynamicTableComponent
  ],
  templateUrl: './partners.component.html',
  styleUrl: './partners.component.scss'
})
export class PartnersComponent {
  private dialogSettings: MatDialogConfig = {
    height: 'auto',
    width: '700px',
    disableClose: true
  }
  public partnerColumns: TableColumn[] = [
    { key: 'name', header: 'Название' },
    { key: 'inn', header: 'ИНН' },
    { key: 'created_at', header: 'Дата создания', type: 'date' },
    { key: 'category', header: 'category' },
    { key: 'person_contact', header: 'Контактное лицо' },
  ];

  public partners: Partner[] = PARTNERS;
  public displayedPartners: Partner[] = [];

  public pageSize= 10;
  public currentPage = 0;
  public readonly totalItems = this.partners.length;
  public readonly pageSizeOptions = [5, 8, 15, 25];

  constructor(
    private headerService: HeaderActionService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.updateDisplayedPartners();
    this.headerService.setComponent(CreatePartnerComponent, 'Добавить компанию');
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updateDisplayedPartners();
  }

  private updateDisplayedPartners() {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.displayedPartners = this.partners.slice(startIndex, endIndex);
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

  public editForm(partner: Partner) {
    const dialogRef = this.dialog.open(
      CreatePartnerComponent, 
      {
        ...this.dialogSettings,
        data: {
          partner: partner
        }
      }
    );

    dialogRef.afterClosed().subscribe(async (result: Partner) => {
      if (result) {
        console.log('Edit partner', result);
        result.created_at = partner.created_at;
        this.partners = this.partners.map(p => p.id === partner.id ? result : p);
        this.updateDisplayedPartners();
        this.snackBar.open('Компания обновлена', 'Закрыть', {
          duration: 3000,
          verticalPosition: 'top',
        });
      }
    });
  }

  public deleteForm(partner: Partner) {
    const dialogRef = this.dialog.open(
      ConfirmationDialogComponent, 
      {
        ...this.dialogSettings,
        data: {
          title: `Удалить компанию "${partner.name}"?`,
          message: 'Вы уверены, что хотите удалить компанию?',
          confirmText: 'Удалить',
          cancelText: 'Отменить'
        }
      }
    );

    dialogRef.afterClosed().subscribe(async (result: boolean) => {
      if (result) {
        console.log('Delete partner', result);
        this.snackBar.open('Компания удалена', 'Закрыть', {
          duration: 3000,
          verticalPosition: 'top',
        });
        // TODO: send request to delete partner 
      }
    });
  }
}
