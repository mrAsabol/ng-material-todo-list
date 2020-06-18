import { Component, OnInit } from '@angular/core';
import { TaskServiceService } from 'src/app/services/task-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NewTaskComponent } from '../new-task/new-task.component';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.css']
})
export class TaskDetailsComponent implements OnInit {

  public taskId: string;
  public selectedTask;

  constructor(private service: TaskServiceService, private route: ActivatedRoute, private router: Router, private dialog: MatDialog) { }

  ngOnInit(): void {

    this.taskId = this.route.snapshot.params.$key;

    this.service.getTasks().subscribe(
      list => {
        let arr = list.map(item => {
          return {
            $key: item.key,
            ...item.payload.val()
          };
        });
        for (const item of arr) {
          if (item.$key === this.taskId){
            this.selectedTask = item;
          }
        }
      });
  }

  goBack() {
    this.router.navigate(['/task-list']);
  }

  onDelete($key) {
    if (confirm('Are you sure you want to delete this item?')){
      this.service.deleteTask($key);
      this.router.navigate(['/task-list']);
    }
  }

  openEdit(row) {
    this.service.populateForm(row);
    this.openDialog();
  }

  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60%';
    dialogConfig.height = '60%';
    this.dialog.open(NewTaskComponent, dialogConfig);
  }
}
