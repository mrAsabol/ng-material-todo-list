import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TaskDetailsComponent } from './components/task-details/task-details.component';
import { TaskListComponent } from './components/task-list/task-list.component';


const routes: Routes = [
  { path: '', redirectTo: '/task-list', pathMatch: 'full' },
  { path: 'task-list', component: TaskListComponent },
  { path: 'task-details/:$key', component: TaskDetailsComponent },
  { path: '**', component: TaskListComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
