import { Component, OnInit } from '@angular/core';
import { TaskServiceService } from '../../services/task-service.service';
import { MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.css']
})
export class NewTaskComponent implements OnInit {

  constructor(public service: TaskServiceService, private dialogRef: MatDialogRef<NewTaskComponent>) { }
  ngOnInit(): void {
    this.service.getTasks();
  }


  onCancel() {
    this.onClose();
  }

  onSubmit() {
    if (!this.service.form.get('$key').value){
      this.service.insertTask(this.service.form.value);
    } else {
      this.service.updateTask(this.service.form.value);
    }
    this.onClose();
  }

  onClose() {
    this.service.form.reset();
    this.service.initFormState();
    this.dialogRef.close();
  }
}
