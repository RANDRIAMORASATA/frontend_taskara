import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TaskModel } from 'src/app/models/task.model';
import { UserModel } from 'src/app/models/user.model';
import { FilterService } from 'src/app/services/filter/filter.service';
import { TaskService, TasksResponse } from 'src/app/services/task/task-service.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-project-task-details',
  templateUrl: './urgent-tasks.component.html',
  styleUrls: ['./urgent-tasks.component.scss'],
})
export class TasksUrgentComponent {
  tasks: TaskModel[] = [];
  searchTermTasks: string = '';
  user: UserModel | undefined;
  urgentTasks: TaskModel[] = [];
  filteredTasks: TaskModel[] = [];

  constructor(
    private taskService: TaskService,
    private cd: ChangeDetectorRef,
    private router: Router,
    private filterService: FilterService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.loadTasks();
    this.loadUrgentTasks();
    this.userService.getUserConnected().subscribe(userConnected => {
      this.user = userConnected;
      console.log('User in user profile:', this.user);

    });

  }
  filterTasks(): void {
    this.urgentTasks = this.filterService.filterItems(this.tasks, this.searchTermTasks, ['name_task', 'description_task']);
  }

  redirectToCreateTask() {
    this.router.navigate(['/create-task', this.user._id_user]);
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe(
      (response: TasksResponse) => { // new interface
        this.tasks = response.tasks;
        this.filteredTasks = this.tasks;
        console.log('Received tasks:', this.tasks); // Log the received taskss
        this.loadUrgentTasks();
        this.cd.detectChanges(); // OnPush strategy
      },
      (error) => {
        console.error('Error fetching tasks', error);
      }
    );
  }
  loadUrgentTasks(): void {
    console.log('All tasks:', this.tasks);

    // If tasks are empty, return early
    if (this.tasks.length === 0) {
      console.log('No tasks to filter');
      return;
    }

    this.urgentTasks = this.tasks.filter(task => {
      const isUrgent = !!task.isUrgent;
      console.log(`Task ${task.name_task} - isUrgent normalized:`, isUrgent);
      return isUrgent;
    });

    console.log('Urgent tasks:', this.urgentTasks);
  }


  redirectToEditTask(_id_user, _task_id) {
    this.router.navigate(['/edit-task', _id_user, _task_id]);
  }

  onDeleteTask(taskId: string) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet tache ?')) {
      this.taskService.deleteTask(taskId).subscribe(response => {
        if (response) {
          console.log('Task deleted successfully:', response);
          // Met à jour la liste des projets
          this.tasks = this.tasks.filter(project => project._id_task !== taskId);
          this.urgentTasks = this.urgentTasks.filter(project => project._id_task !== taskId);
          this.cd.detectChanges();
        } else {
          console.error('Failed to delete task');
        }
      });
    }
  }

}

