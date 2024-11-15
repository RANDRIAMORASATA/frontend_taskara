import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgbDate, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { ProjectModel } from 'src/app/models/project.model';
import { TaskModel } from 'src/app/models/task.model';
import { ProjectService, ProjectsResponse } from 'src/app/services/project/project-service.service';
import { AuthService } from 'src/app/services/auth/auth-service.service';
import { UserService } from 'src/app/services/user/user.service';
import { catchError, Observable, of } from 'rxjs';
import { UserModel } from 'src/app/models/user.model';
import { TaskService, TasksResponse } from 'src/app/services/task/task-service.service';
import { Router } from '@angular/router';
import { FilterService } from 'src/app/services/filter/filter.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard-acceuil.component.html',
  styleUrls: ['./dashboard-acceuil.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardAcceuilComponent implements OnInit {

  public clicked: boolean = true;
  public clicked1: boolean = false;

  fromDate: NgbDate;
  toDate: NgbDate;
  hoveredDate: NgbDate;


  tasks: TaskModel[] = [];
  user$: Observable<UserModel | undefined> = of();
  user: UserModel | undefined;
  projects: ProjectModel[] = [];
  filteredProjects: ProjectModel[] = [];
  filteredTasks: TaskModel[] = [];
  filteredUrgentTasks: TaskModel[] = [];
  urgentTasks: TaskModel[] = [];
  searchTermProjects: string = '';
  searchTermTasks: string = '';
  searchTermUrgentTasks: string = '';
  isUpdatedTask: boolean = false;
  isUpdatedProject: boolean = false;
  performance: number = 0;

  constructor(calendar: NgbCalendar,
    private router: Router,
    private filterService: FilterService,
    private projectService: ProjectService,
    private authService: AuthService,
    private userService: UserService,
    private taskService: TaskService,
    private cd: ChangeDetectorRef
  ) {
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
  }


  ngOnInit(): void {
    this.loadProjects();
    this.loadTasks();
    this.loadUrgentTasks();
    this.userService.getUserConnected().subscribe(userConnected => {
      this.user = userConnected;
      console.log('User in dashboard:', this.user);
    });

  }

  filterProjects(): void {
    this.filteredProjects = this.filterService.filterItems(this.projects, this.searchTermProjects, ['name_project', 'description_project']);
  }
  filterTasks(): void {
    this.filteredTasks = this.filterService.filterItems(this.tasks, this.searchTermTasks, ['name_task', 'description_task']);
  }
  filterUrgentTasks(): void {
    this.filteredUrgentTasks = this.filterService.filterItems(this.tasks, this.searchTermUrgentTasks, ['name_task', 'description_task']);
  }

  loadProjects(): void {
    this.projectService.getProjects().subscribe(
      (response: ProjectsResponse) => { // new interface
        this.projects = response.projects;
        this.filteredProjects = this.projects;
        console.log('Received projects:', this.projects); // Log the received projects
        this.cd.detectChanges(); // OnPush strategy

      },
      (error) => {
        console.error('Error fetching projects', error);
      }
    );
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

  redirectToListProject(_id_user) {
    this.router.navigate(['/list-project', _id_user]);
  }
  redirectToListProjects() {
    this.router.navigate(['/list-projects']);
  }
  redirectToListTask(_id_user) {
    this.router.navigate(['/list-task', _id_user]);
  }
  redirectToListTasks() {
    this.router.navigate(['/list-tasks']);
  }

  redirectToUrgentTasks(_id_user): void {
    this.router.navigate(['/urgent-tasks', _id_user]);
  }
  redirectToUrgentTask(): void {
    this.router.navigate(['/urgent-tasks']);
  }

}
