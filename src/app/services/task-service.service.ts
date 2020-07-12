import { Injectable } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AngularFireList, AngularFireDatabase } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class TaskServiceService {

  constructor(private firebase: AngularFireDatabase) { }

  taskList: AngularFireList<any>;

  form: FormGroup = new FormGroup({
    $key: new FormControl(null),
    name: new FormControl(''),
    description: new FormControl(''),
    created: new FormControl(''),
    isCompleted: new FormControl(false)
  });

  initFormState() {
    this.form.setValue({
      $key: null,
      name: '',
      description: '',
      created: null,
      isCompleted: false
    });
  }

  getTasks() {
    this.taskList = this.firebase.list('tasks');
    return this.taskList.snapshotChanges();
  }

  insertTask(task) {
    this.taskList.push({
      name: task.name,
      description: task.description,
      created: Date.now(),
      isCompleted: task.isCompleted
    });
  }

  updateTask(task) {
    this.taskList.update(task.$key, {
      name: task.name,
      description: task.description,
      created: Date.now(),
      isCompleted: task.isCompleted
    });
  }

  deleteTask($key: string) {
    this.taskList.remove($key);
  }

  populateForm(task){
    this.form.setValue(task);
  }

}
