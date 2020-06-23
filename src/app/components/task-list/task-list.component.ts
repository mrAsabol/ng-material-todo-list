import { Component, OnInit, ViewChild } from '@angular/core';
import { TaskServiceService } from 'src/app/services/task-service.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { NewTaskComponent } from '../new-task/new-task.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {

  constructor(private service: TaskServiceService, private dialog: MatDialog, private router: Router) { }

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  searchKey: string;


  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['key', 'name', 'description', 'created', 'actions'];

  ngOnInit(): void {
    this.service.getTasks().subscribe(
      list => {
        const arr = list.map(item => {
          return {
            $key: item.key,
            ...item.payload.val()
          };
        });
        console.log("x");
        this.listData = new MatTableDataSource(arr);
        this.listData.sort = this.sort;
        this.listData.paginator = this.paginator;
      });
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

}
