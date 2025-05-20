import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {FlexModule} from '@angular/flex-layout';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatOptionModule} from '@angular/material/core';
import {CommonModule} from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSelectModule} from '@angular/material/select';
import {Domain, DomainStatus, Partner} from '@app/pages/forms-constructor/interfaces';
import {DomainService} from '@app/services/api/domain';
import {PartnerService} from '@app/services/api/partner';

@Component({
  selector: 'app-create-domain',
  templateUrl: './create-domain.component.html',
  styleUrls: ['./create-domain.component.scss'],
  imports: [
    MatDialogModule,
    MatButtonModule,
    FlexModule,
    MatFormFieldModule,
    MatOptionModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    MatCheckboxModule,
    MatSelectModule,
  ],
})
export class CreateDomainComponent implements OnInit {
  public form: FormGroup;
  public imagePreview: string | ArrayBuffer | null = null;
  public isEditMode = false;
  public partners: Partner[] = [];

  constructor(
    private fb: FormBuilder,
    private domainService: DomainService,
    private partnerService: PartnerService,
    public dialogRef: MatDialogRef<CreateDomainComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { domain: Domain } | null
  ) {
    const urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;

    this.form = this.fb.group({
      partner: [this.data?.domain?.partner?.id || ''],
      url: [this.data?.domain?.url || '', [Validators.required]],  // , Validators.pattern(urlRegex)
      status: [this.data?.domain?.status || DomainStatus.ACTIVE, [Validators.required]],
    });
  }

  async ngOnInit() {
    if (this.data?.domain) this.isEditMode = true;
    await this.getPartners();
  }

  public async onSubmit() {
    if (this.form.valid) {
      if (this.isEditMode) {
        (await this.domainService.updateDomain(this.data?.domain?.id!, this.form.value)).subscribe(({
          next: (domain: Domain) => {
            this.dialogRef.close(domain);
          },
          error: (err: any) => {
            console.log('Error updating domain', err);
          },
        }));
      } else {
        (await this.domainService.createDomain(this.form.value)).subscribe({
          next: (domain: Domain) => {
            this.dialogRef.close(domain);
          },
          error: (err: any) => {
            console.log('Error creating domain', err);
          }
        });
      }
    }
  }

  public async getPartners() {
    (await this.partnerService.getPartners()).subscribe({
      next: (partners: Partner[]) => {
        this.partners = partners;
      },
      error: (err: any) => {
        console.log('Error getting partners', err);
      }
    });
  }
}
