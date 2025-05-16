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
import { Partner } from '@app/pages/forms-constructor/interfaces';

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

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CreatePartnerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { partner: Partner } | null
  ) {
    const urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;

    this.form = this.fb.group({
      name:  [this.data?.partner.name || '', Validators.required],
      domain:  [this.data?.partner.domain?.url || '', [Validators.required, Validators.pattern(urlRegex)]],
      inn: [this.data?.partner.inn || '', [Validators.required, Validators.maxLength(14), Validators.minLength(14)]],
      category: [this.data?.partner.category || '1', [Validators.required]],
      person_contact: [this.data?.partner.person_contact || '', [Validators.required]],
    });
  }

  ngOnInit() {
    if (this.data?.partner) this.isEditMode = true;
  }

  public onSubmit() {
    if (this.form.valid) {
      this.dialogRef.close(
        {
          ...this.form.value,
          domain: {
            url: this.form.value.domain
          }
        }
      );
    }
  }
}
