import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TaskModel } from 'src/app/models/task.model';
import { UserModel } from 'src/app/models/user.model';
import { FilterService } from 'src/app/services/filter/filter.service';
import { TaskService, TasksResponse } from 'src/app/services/task/task-service.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-update-task',
  templateUrl: './list-task.component.html',
  styleUrls: ['./list-task.component.scss']
})
export class ListTaskComponent implements OnInit {
  tasks: TaskModel[] = [];
  filteredTasks: TaskModel[] = [];
  searchTermTasks: string = '';
  user: UserModel | undefined;

  constructor(
    private taskService: TaskService,
    private cd: ChangeDetectorRef,
    private router: Router,
    private filterService: FilterService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.loadTasks();
    this.userService.getUserConnected().subscribe(userConnected => {
      this.user = userConnected;
      console.log('User in user profile:', this.user);
    });


  }
  filterTasks(): void {
    this.filteredTasks = this.filterService.filterItems(this.tasks, this.searchTermTasks, ['name_task', 'description_task']);
  }

  redirectToCreateTask() {
    this.router.navigate(['/create-task', this.user._id_user]);
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe(
      (response: TasksResponse) => {
        this.tasks = response.tasks; //les tâches reçues
        this.filteredTasks = this.tasks; //  les tâches filtrés
        this.cd.detectChanges(); // l'affichage en utlisant la stratégie OnPush
        console.log('Received tasks:', this.tasks); // Log des tâches reçues
      },
      (error) => {
        console.error('Error fetching tasks', error); // Log des erreurs
      }
    );
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
          this.filteredTasks = this.filteredTasks.filter(project => project._id_task !== taskId);
          this.cd.detectChanges();
        } else {
          console.error('Failed to delete task');
        }
      });
    }
  }

}
