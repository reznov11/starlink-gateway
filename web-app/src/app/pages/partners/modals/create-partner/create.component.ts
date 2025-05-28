import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FlexModule } from '@angular/flex-layout';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { Domain, Partner } from '@app/pages/forms-constructor/interfaces';
import { PartnerService } from '@app/services/api/partner';
import { DomainService } from '@app/services/api/domain';

@Component({
  selector: 'app-create-partner',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
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
export class CreatePartnerComponent implements OnInit {
  public form: FormGroup;
  public imagePreview: string | ArrayBuffer | null = null;
  public isEditMode = false;
  public domains: Domain[] = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CreatePartnerComponent>,
    private partnerService: PartnerService,
    private domainService: DomainService,
    @Inject(MAT_DIALOG_DATA) public data: { partner: Partner } | null
  ) {
    this.form = this.fb.group({
      is_active: [this.data?.partner.is_active, [Validators.required]],
      name:  [this.data?.partner.name || '', [Validators.required]],
      source:  [this.data?.partner.source || '', [Validators.required]],
      domain:  [this.data?.partner.domain! || '', [Validators.required]],
      inn: [this.data?.partner.inn || '', [
        Validators.required,
        Validators.maxLength(14),
        Validators.minLength(14)]
      ],
      category: [this.data?.partner.category || '1', [Validators.required]],
      person_contact: [this.data?.partner.person_contact || '', [Validators.required]],
    });
  }

  async ngOnInit() {
    if (this.data?.partner) this.isEditMode = true;
    await this.getDomains();
  }

  public async getDomains() {
    const domains = await this.domainService.getDomainsList();
    domains.subscribe((domains: Domain[]) => {
      this.domains = domains;
    });
  }

  public async onSubmit() {
    if (this.form.valid) {
      if (this.form.valid) {
        if (this.isEditMode) {
          (await this.partnerService.updatePartner(this.data?.partner.id!, this.form.value)).subscribe(({
            next: (partner: Partner) => {
              this.dialogRef.close(partner);
            },
            error: (err: any) => {
              console.log('Error updating domain', err);
            },
          }));
        } else {
          (await this.partnerService.createPartner(this.form.value)).subscribe({
            next: (partner: Partner) => {
              this.dialogRef.close(partner);
            },
            error: (err: any) => {
              console.log('Error creating partner', err);
            }
          });
        }
      }
    }
  }
}
