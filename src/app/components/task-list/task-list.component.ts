import { Component, OnInit, ViewChild } from '@angular/core';
import { TaskServiceService } from 'src/app/services/task-service.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { NewTaskComponent } from '../new-task/new-task.component';
import { Router } from '@angular/router';
import {SelectionModel} from '@angular/cdk/collections';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  original: any[];

  constructor(private service: TaskServiceService, private dialog: MatDialog, private router: Router) { }

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  searchKey: string;


  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['select', 'key', 'name', 'description', 'created', 'isCompleted', 'actions'];
  selection = new SelectionModel<any>(true, []);

  ngOnInit(): void {
    this.service.getTasks().subscribe(
      list => {
        const arr = list.map(item => {
          return {
            $key: item.key,
            ...item.payload.val()
          };
        });
        this.listData = new MatTableDataSource(arr);
        this.listData.sort = this.sort;
        this.listData.paginator = this.paginator;
        this.original = this.listData.data;
      });
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.listData.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.listData.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  onSearchClear() {
    this.searchKey = '';
    this.applyFilter();
  }

  applyFilter() {
    this.listData.filter = this.searchKey.trim().toLocaleLowerCase();
  }

  onCreate() {
    this.openDialog();
  }

  onEdit(row) {
    this.service.populateForm(row);
    this.openDialog();
  }

  onDelete($key){
    if (confirm('Are you sure you want to delete this item?')){
      this.service.deleteTask($key);
    }
  }

  onDeleteSelected(){
    if (confirm('Are you sure you want to delete these items?')){
      for (const iterator of this.selection.selected) {
        const key = iterator.$key;
        this.service.deleteTask(key);
      }
    }
  }

  openDetails($key) {
    this.router.navigate(['/task-details', $key]);
  }

  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60%';
    dialogConfig.height = '60%';
    this.dialog.open(NewTaskComponent, dialogConfig);
  }

  taskStateChange(row) {
    this.service.populateForm(row);
    this.service.updateTask(this.service.form.value);
  }

  completionFilter(button) {
    let tempFiltered = [];
    if (button.id === 'completed') {
      this.listData.data = this.original;
      tempFiltered = this.listData.data.filter((x) => x.isCompleted === true);
      this.listData.data = tempFiltered;
    } else if (button.id === 'notCompleted') {
      this.listData.data = this.original;
      tempFiltered = this.listData.data.filter((x) => x.isCompleted === false);
      this.listData.data = tempFiltered;
    } else if (button.id === 'all') {
      this.listData.data = this.original;
    }
  }
}
