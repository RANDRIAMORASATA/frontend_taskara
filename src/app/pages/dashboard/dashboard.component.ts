import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgbDate, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import Chart from 'chart.js';

// core components
import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2
} from "../../variables/charts";
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
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {

  public datasets: any;
  public data: any;
  public salesChart;
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
  searchTermProjects: string = '';
  searchTermTasks: string = '';
  isUpdatedTask: boolean = false;
  isUpdatedProject: boolean = false;

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
    this.userService.getUserConnected().subscribe(userConnected => {
      this.user = userConnected;
      console.log('User in dashboard:', this.user);
    });
    this.loadProjects();
    this.loadTasks();
    this.datasets = [
      [0, 20, 10, 30, 15, 40, 20, 60, 60],
      [0, 20, 5, 25, 10, 30, 15, 40, 40]
    ];
    this.data = this.datasets[0];

    var chartOrders = document.getElementById('chart-orders');

    parseOptions(Chart, chartOptions());

    var ordersChart = new Chart(chartOrders, {
      type: 'bar',
      options: chartExample2.options,
      data: chartExample2.data
    });

  }
  filterProjects(): void {
    this.filteredProjects = this.filterService.filterItems(this.projects, this.searchTermProjects, ['name_project', 'description_project']);
  }
  filterTasks(): void {
    this.filteredTasks = this.filterService.filterItems(this.tasks, this.searchTermTasks, ['name_task', 'description_task']);
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
        this.cd.detectChanges(); // OnPush strategy
      },
      (error) => {
        console.error('Error fetching tasks', error);
      }
    );
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

  onDeleteProject(projectId: string) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet projet ?')) {
      this.projectService.deleteProject(projectId).subscribe(response => {
        if (response) {
          console.log('Project deleted successfully:', response);
          // Met à jour la liste des projets
          this.projects = this.projects.filter(project => project._id_project !== projectId);
          this.filteredProjects = this.filteredProjects.filter(project => project._id_project !== projectId);
          this.cd.detectChanges();
        } else {
          console.error('Failed to delete project');
        }
      });
    }
  }

  public updateOptions() {
    this.salesChart.data.datasets[0].data = this.data;
    this.salesChart.update();
  }

  onDateSelection(date: NgbDate) {
    console.log(this.fromDate);

    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
    console.log(this.toDate);
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || date.equals(this.toDate) || this.isInside(date) || this.isHovered(date);
  }

  redirectToCreateProject(_id_user) {
    this.router.navigate(['/create-project', _id_user]);
  }
  redirectToListProject(_id_user) {
    this.router.navigate(['/list-project', _id_user]);
  }
  redirectToCreateTask(_id_user) {
    this.router.navigate(['/create-task', _id_user]);
  }
  redirectToListTask(_id_user) {
    this.router.navigate(['/list-task', _id_user]);
  }

  redirectToEditProject(_id_user, _project_id) {
    this.router.navigate(['/edit-project', _id_user, _project_id]);
  }


}
