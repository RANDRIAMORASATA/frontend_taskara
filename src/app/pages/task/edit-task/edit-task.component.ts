import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskService } from 'src/app/services/task/task-service.service';
import { UserService } from 'src/app/services/user/user.service';
import { UserModel } from 'src/app/models/user.model';
import { TaskModel } from '../../../models/task.model';
import { ActivatedRoute, Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.scss']
})
export class EditTaskComponent implements OnInit {
  projectForm: FormGroup;
  user: UserModel | undefined;
  _id_task: string | null = null;
  createdAt: Date | null = null;
  dueDate: NgbDate | null = null;
  isUrgent: boolean = false;
  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this._id_task = this.route.snapshot.paramMap.get('_id_task');
    console.log('Task ID from route:', this._id_task);

    if (this._id_task) {
      this.fetchTask(this._id_task);
    } else {
      console.error('Task ID is missing');
    }

    this.projectForm = this.fb.group({
      _id_task: [{ value: this._id_task, disabled: true }],
      name_task: ['', Validators.required],
      description_task: ['', Validators.required],
      status: ['', Validators.required],
      updatedAt: [{ value: new Date(), disabled: true }],
      isUrgent: [false]
    });

    this.userService.getUserConnected().subscribe(userConnected => {
      this.user = userConnected;
      console.log('User editing task:', userConnected);
    });

    this.projectForm.get('status')?.valueChanges.subscribe(status => {
      this.isUrgent = status === 'urgent'; // Si "urgent", alors isUrgent = true
    });
  }

  fetchTask(_id_task: string) {
    this.taskService.getTaskById(_id_task).subscribe(
      (response: { task: TaskModel }) => {
        const task = response.task;
        console.log('Fetched task:', task);
        this.createdAt = task.createdAt;
        this.isUrgent = task.status === 'urgent';
        this.projectForm.patchValue({
          name_task: task.name_task,
          description_task: task.description_task,
          status: task.status,
          createsAt: task.createdAt,
          isUrgent: this.isUrgent
        });
        console.log('Form values after patching:', this.projectForm.value);
      },
      (error) => {
        console.error('Error retrieving task:', error);
      }
    );
  }

  onSubmit() {
    if (this.projectForm.valid) {
      const taskData: TaskModel = {
        _id_task: this._id_task!,
        name_task: this.projectForm.value.name_task,
        description_task: this.projectForm.value.description_task,
        createdAt: this.createdAt || new Date(),
        updatedAt: new Date(),
        status: this.projectForm.value.status,
        _user_id: this.user?._id_user || '',
        isUrgent: this.projectForm.value.isUrgent
      };

      console.log('Task data before update:', taskData);
      this.taskService.editTask(taskData).subscribe(
        response => {
          console.log('Task updated successfully:', response);
          this.router.navigate(['/list-task', taskData._user_id]);
        },
        error => {
          console.error('Error updating task:', error);
        }
      );
    } else {
      console.error('Form is invalid:');
      this.projectForm.markAllAsTouched();
    }
  }

}
