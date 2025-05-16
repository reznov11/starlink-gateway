import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { MatColumnDef, MatHeaderCell, MatHeaderCellDef, MatTableDataSource, MatTableModule } from '@angular/material/table';
import {PageEvent} from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';
import { CustomPaginatorComponent } from '@components/paginator/paginator.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';

export type ColumnType =
  'text' |
  'number' |
  'date' |
  'action' |
  'boolean' |
  'active_status' |
  'user' |
  'partner';

export interface TableColumn {
  key: string;
  header: string;
  type?: ColumnType;
  format?: (value: any) => string;
  width?: string;
}

@Component({
  selector: 'app-dynamic-table',
  templateUrl: './dynamic-table.component.html',
  styleUrls: ['./dynamic-table.component.scss'],
  imports: [
    CommonModule,
    MatFormField,
    MatInputModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatTabsModule,
    MatTableModule,
    MatHeaderCell,
    MatHeaderCellDef,
    MatColumnDef,
    MatMenuModule,
    ReactiveFormsModule,
    CustomPaginatorComponent
  ]
})
export class DynamicTableComponent implements OnInit, OnChanges {
  @Input() columns: any[string] = [];
  @Input() data: Array<any> = [];
  @Input() showActions = true;
  @Input() totalItems = 0;
  @Input() pageSize = 10;
  @Input() currentPage = 0;
  @Input() pageSizeOptions = [5, 10, 20];

  @Output() actionClicked = new EventEmitter<{action: string, item: any}>();
  @Output() pageChanged = new EventEmitter<PageEvent>();

  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = [];
  searchControl = new FormControl('');

  ngOnInit() {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(searchText => {
      this.applyFilter(searchText || '');
    });
  }

  ngOnChanges() {
    this.displayedColumns = this.columns.map((c: any) => c.key);

    if (this.showActions) {
      this.displayedColumns.push('actions');
    }

    this.dataSource.data = this.data;
  }

  applyFilter(filterValue: string) {
    this.pageChanged.emit({
      pageIndex: 0,
      pageSize: this.pageSize,
      length: this.totalItems,
      previousPageIndex: 0
    });

    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onPageChange(event: PageEvent) {
    this.pageChanged.emit(event);
  }

  onActionClick(action: string, item: any) {
    this.actionClicked.emit({ action, item });
  }
}
