import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FlexLayoutModule } from '@angular/flex-layout';

@Component({
  selector: 'app-preview-form-modal',
  templateUrl: './preview-form-modal.component.html',
  styleUrls: ['./preview-form-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatCheckboxModule,
    MatSnackBarModule,
    FlexLayoutModule
  ]
})
export class PreviewFormModalComponent {
  constructor(
    public dialogRef: MatDialogRef<PreviewFormModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { formElements: any[]; title: string },
    private snackBar: MatSnackBar
  ) { }

  close(): void {
    this.dialogRef.close();
  }

  createForm(): void {
    this.dialogRef.close();
    this.snackBar.open('Форма успешно создана', '', {
      duration: 3000,
      panelClass: 'success-snackbar',
    });
  }

  getOptionLabel(element: any): string {
    if (!element.options || !element.value) return '';
    const found = element.options.find((opt: any) => opt.id === element.value);
    return found ? found.value : element.value;
  }
}
