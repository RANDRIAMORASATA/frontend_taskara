import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectModel } from 'src/app/models/project.model';
import { TaskModel } from 'src/app/models/task.model';
import { UserModel } from 'src/app/models/user.model';
import { TaskService } from 'src/app/services/task/task-service.service';
import { UserService } from 'src/app/services/user/user.service';


@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.scss']
})
export class CreateTaskComponent implements OnInit {
  taskForm: FormGroup;
  user: UserModel | undefined;
  isUpdateMode: boolean = false;
  taskId: string | null = null;


  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute) { }
  generateId(): string {
    return 'task_' + Math.random().toString(36).substr(2, 9);
  }

  ngOnInit(): void {
    const _id_task = this.generateId();
    this.taskForm = this.fb.group({
      _id_task: [{ value: _id_task, disabled: true }],
      task_name: ['', Validators.required],
      description_task: ['', Validators.required],
      status: ['', Validators.required],
    });

    this.userService.getUserConnected().subscribe(userConnected => {
      this.user = userConnected;
      //this.projectForm.patchValue({ _user_id: this.user?._id_user });
      console.log('user create project:', userConnected)
    });
  }
  onSubmit() {
    console.log('Form values:', this.taskForm.value);
    if (this.taskForm.valid) {
      const taskData: TaskModel = {
        _id_task: this.taskForm.value._id_task,
        name_task: this.taskForm.value.task_name,
        description_task: this.taskForm.value.description_task,
        status: this.taskForm.value.status,
        _user_id: this.user?._id_user || '',
        createdAt: new Date(),

      };
      console.log('TaskData:', taskData);
      this.taskService.createTask(taskData).subscribe({
        next: (response) => {
          console.log('Task created successfully:', response);
          this.router.navigate(['/list-task', this.user?._id_user]);
        },
        error: (error) => {
          console.error('Error creating task:', error);
          alert('Une erreur est survenue lors de l\'enregistrement. Veuillez vérifier vos données.');
        }
      });

    } else {
      console.log('Form is invalid');
      this.taskForm.markAllAsTouched();
    }
  }

}
