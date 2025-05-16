import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

interface PageItem {
  type: 'number' | 'ellipsis';
  value: number;
  display: string;
}

@Component({
  selector: 'app-custom-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss'],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule
  ]
})
export class CustomPaginatorComponent {
  @Input() currentPage: number = 0;
  @Input() totalPages: number = 0;
  @Input() pageSize: number = 5;
  @Input() totalItems: number = 0;
  @Output() pageChange = new EventEmitter<PageEvent>();

  get visiblePages(): PageItem[] {
    if (this.totalPages <= 5) {
      return Array.from({length: this.totalPages}, (_, i) => ({
        type: 'number',
        value: i,
        display: (i + 1).toString()
      }));
    }

    const pages: PageItem[] = [];
    const maxVisible = 5;
    const halfVisible = Math.floor(maxVisible / 2);

    pages.push({ type: 'number', value: 0, display: '1' });

    let start = Math.max(1, this.currentPage - halfVisible);
    let end = Math.min(this.totalPages - 2, this.currentPage + halfVisible);

    if (this.currentPage <= halfVisible) {
      end = maxVisible - 2;
    } else if (this.currentPage >= this.totalPages - 1 - halfVisible) {
      start = this.totalPages - maxVisible + 1;
    }

    if (start > 1) {
      pages.push({ type: 'ellipsis', value: -1, display: '...' });
    }

    for (let i = start; i <= end; i++) {
      pages.push({ type: 'number', value: i, display: (i + 1).toString() });
    }

    if (end < this.totalPages - 2) {
      pages.push({ type: 'ellipsis', value: -1, display: '...' });
    }

    pages.push({
      type: 'number',
      value: this.totalPages - 1,
      display: this.totalPages.toString()
    });

    return pages;
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.emitPageEvent(this.currentPage - 1, this.pageSize);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.emitPageEvent(this.currentPage + 1, this.pageSize);
    }
  }

  goToPage(page: number): void {
    this.emitPageEvent(page, this.pageSize);
  }

  private emitPageEvent(pageIndex: number, pageSize: number): void {
    this.pageChange.emit({
      pageIndex,
      pageSize,
      length: this.totalItems
    } as PageEvent);
  }
}
