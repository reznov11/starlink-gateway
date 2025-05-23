import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Clipboard } from '@angular/cdk/clipboard';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { getFrameCodeTemplate } from '@app/components/frame-code-template/frame-code-template';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';

@Component({
  selector: 'app-show-frame-code-modal',
  templateUrl: './show-frame-code-modal.component.html',
  styleUrls: ['./show-frame-code-modal.component.scss'],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class ShowFrameCodeModalComponent implements OnInit {
  public frameCode: string = '';
  public highlightedCode: string = '';
  private originUrl: string = window.location.origin;

  @ViewChild('highlightContainer') highlightContainer!: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<ShowFrameCodeModalComponent>,
    private clipboard: Clipboard,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    hljs.configure({
      ignoreUnescapedHTML: true,
      throwUnescapedHTML: false
    });
  }

  ngOnInit() {
    if (this.data) {
      this.frameCode = getFrameCodeTemplate(this.data, this.originUrl);
      this.highlightedCode = hljs.highlight(
        this.frameCode,
        {
          language: 'html',
          ignoreIllegals: true
        }
      ).value;
    }
  }

  public close(): void {
    this.dialogRef.close();
  }

  public copyCodeToClipboard(): void {
    const success = this.clipboard.copy(this.frameCode);
    if (success) {
      this.snackBar.open('Код успешно скопирован!', 'Закрыть', {
        duration: 3000,
        panelClass: 'success-snackbar',
        verticalPosition: 'top',
      });
    } else {
      this.snackBar.open('Не удалось скопировать код', 'Закрыть', {
        duration: 3000,
        panelClass: 'error-snackbar'
      });
    }
  }
}
