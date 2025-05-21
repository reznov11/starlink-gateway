import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormSettings } from '@app/pages/forms-constructor/interfaces';
import { FormElement } from '@app/pages/forms-constructor/create-form/models';
import { FormComponentsComponent } from '@app/components/form-components/form-components.component';

@Component({
  selector: 'app-form-settings-modal',
  templateUrl: './form-settings-modal.component.html',
  styleUrls: ['./form-settings-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatCheckboxModule,
    MatSnackBarModule,
    FlexLayoutModule,
    FormComponentsComponent
  ]
})
export class FormSettingsModalComponent {
  formGroup: FormGroup;
  previewSettings: FormSettings;

  get buttonForm(): FormGroup {
    return this.formGroup.get('button') as FormGroup;
  }

  get logoForm(): FormGroup {
    return this.formGroup.get('logo') as FormGroup;
  }

  constructor(
    public dialogRef: MatDialogRef<FormSettingsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { settings: FormSettings, formElements: FormElement[] },
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.previewSettings = { ...data.settings };
    this.formGroup = this.fb.group({
      type: [data.settings.type, Validators.required],
      button: this.fb.group({
        background: [data.settings.button?.background || '#FFFFFF'],
        text: [data.settings.button?.text || 'Бакай банк'],
        size: [data.settings.button?.size || 'md'],
        textColor: [data.settings.button?.textColor || '#000000'],
        fontSize: [data.settings.button?.fontSize || 'md'],
        hasShadow: [data.settings.button?.hasShadow || false],
        isRounded: [data.settings.button?.isRounded || false]
      }),
      logo: this.fb.group({
        image: [data.settings.logo?.image || ''],
        size: [data.settings.logo?.size || 'md'],
        isCircle: [data.settings.logo?.isCircle || false]
      })
    });

    this.formGroup.valueChanges.subscribe(value => {
      this.previewSettings = value;
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.logoForm.get('image')?.setValue(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  save(): void {
    if (this.formGroup.valid) {
      this.dialogRef.close(this.formGroup.value);
    } else {
      this.snackBar.open('Please fill in all required fields', 'Close', {
        duration: 3000,
        verticalPosition: 'top'
      });
    }
  }
}
