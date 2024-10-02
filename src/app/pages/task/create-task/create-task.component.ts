import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjectModel } from 'src/app/models/project.model';
import { TaskService } from 'src/app/services/task/task-service.service';


@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.scss']
})
export class CreateTaskComponent implements OnInit {
  taskForm: FormGroup;

  constructor(private fb: FormBuilder, private taskService: TaskService) { }

  ngOnInit(): void {
    this.taskForm = this.fb.group({
      projectName: ['Projet 1', Validators.required],
      name: ['', Validators.required],
      description: ['', Validators.required],
      status: ['', Validators.required],
    });

  }
  onSubmit() {
    if (this.taskForm.valid) {
      this.taskService.createTask(this.taskForm.value).subscribe(
        response => {
          console.log('Task created successfully', response);
          // Optionally reset the form or navigate to another page
          this.taskForm.reset();
        },
        error => {
          console.error('Error creating task', error);
        }
      );
    }
  }
}
