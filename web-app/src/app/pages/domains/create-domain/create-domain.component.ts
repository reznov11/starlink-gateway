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
import {Domain, DomainStatus} from '@app/pages/forms-constructor/interfaces';

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
  public selectedDomain: string = 'house';

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CreateDomainComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { domain: Domain } | null
  ) {
    const urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;

    this.form = this.fb.group({
      partner: [this.data?.domain?.partner || '', [Validators.required]],
      url: [this.data?.domain?.url || '', [Validators.required, Validators.pattern(urlRegex)]],
      status: [this.data?.domain?.status || DomainStatus.ACTIVE, [Validators.required]],
    });
  }

  ngOnInit() {
    if (this.data?.domain) this.isEditMode = true;
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
