import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-confirmation-dialog',
  template: `
    <div class="confirmation-dialog__container">
      <div class="confirmation-dialog__header">
        <div class="confirmation-dialog__title">{{ data.title }}</div>
        <button mat-icon-button (click)="dialogRef.close()" aria-label="Закрыть" class="confirmation-dialog__close">
          <mat-icon svgIcon="custom_close"></mat-icon>
        </button>
      </div>
      <div class="confirmation-dialog__divider"></div>
      <div class="confirmation-dialog__body">
        <div class="confirmation-dialog__message">{{ data.message }}</div>
      </div>
      <div class="confirmation-dialog__actions">
        <button mat-button [mat-dialog-close]="false" class="confirmation-btn" id="cancel-btn">
          {{ data.cancelText || 'Cancel' }}
        </button>
        <button mat-raised-button color="warn" [mat-dialog-close]="true" class="confirmation-btn" id="confirm-btn">
          {{ data.confirmText || 'Confirm' }}
        </button>
      </div>
    </div>
  `,
  styleUrls: ['./confirmation-dialog.component.scss'],
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class ConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
}
