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

  constructor(calendar: NgbCalendar,
    private router: Router,
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

  loadProjects(): void {
    this.projectService.getProjects().subscribe(
      (response: ProjectsResponse) => { // Use the new interface
        this.projects = response.projects; // Now this should work
        this.cd.detectChanges(); // Optional for OnPush strategy
        console.log('Received projects:', this.projects); // Log the received projects
      },
      (error) => {
        console.error('Error fetching projects', error);
      }
    );
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

  redirectToCreateProject() {
    this.router.navigate(['/create-project/:userName']);
  }
  redirectToListProject() {
    this.router.navigate(['/list-project/:userId']);
  }
  redirectToCreateTask() {
    this.router.navigate(['/create-task/:userName']);
  }
  redirectToListTask() {
    this.router.navigate(['/list-task/:userId']);
  }


}
