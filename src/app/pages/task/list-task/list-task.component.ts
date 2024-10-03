import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TaskModel } from 'src/app/models/task.model';
import { TaskService, TasksResponse } from 'src/app/services/task/task-service.service';

@Component({
  selector: 'app-update-task',
  templateUrl: './list-task.component.html',
  styleUrls: ['./list-task.component.scss']
})
export class ListTaskComponent implements OnInit {
  tasks: TaskModel[] = [];
  constructor(
    private taskService: TaskService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadTasks()
  }

  loadTasks() {
    this.taskService.getTasks().subscribe(
      (response: TasksResponse) => {
        this.tasks = response.tasks;
        this.cd.detectChanges();
        console.log('Received tasks', this.tasks);

      },
      (error) => {
        console.error('Error fetching tasks', error);
      }
    );
  }
}
