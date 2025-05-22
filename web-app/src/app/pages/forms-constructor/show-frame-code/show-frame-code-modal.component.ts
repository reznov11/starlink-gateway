import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Clipboard } from '@angular/cdk/clipboard';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import {Highlight} from 'ngx-highlightjs';

@Component({
  selector: 'app-show-frame-code-modal',
  templateUrl: './show-frame-code-modal.component.html',
  styleUrls: ['./show-frame-code-modal.component.scss'],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    Highlight
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

      this.frameCode = `
<div data-domain="${this.data.domain!.code}" data-partner="${this.data.partner!.id}"></div>
<script type="text/javascript">
    window.partnerId = "${this.data.partner!.id}";
    window.partnerDomain = "${this.data.domain!.code}";
    window.partnerUrl = "${this.data.domain!.url}";
    window.originUrl = "${this.originUrl}";
    window.lang = "ru";

    const headers = new Headers();
    headers.set('Content-Type', 'application/json');

    window.fetch(
        "${this.originUrl}/api/partners/manifest/",
        {
          headers: headers
        }
    )
    .then((res) => {
        return res;
    }).then(async (res) => {
        if (res.status === 202) {
            const ifrPartner = document.createElement("script");
            const data = await res.json()
            ifrPartner.type = "text/javascript";
            ifrPartner.async = true;
            ifrPartner.src = data["application"];
            document.body.appendChild(ifrPartner);
            return res;
        } else {
            console.log("Error", res);
            return;
        }
    });
</script>
`;
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
        panelClass: 'success-snackbar'
      });
    } else {
      this.snackBar.open('Не удалось скопировать код', 'Закрыть', {
        duration: 3000,
        panelClass: 'error-snackbar'
      });
    }
  }
}
