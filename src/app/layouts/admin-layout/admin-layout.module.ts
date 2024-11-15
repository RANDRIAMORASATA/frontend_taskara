import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ClipboardModule } from 'ngx-clipboard';
import { MatCardModule } from '@angular/material/card';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from 'src/app/pages/dashboard/dashboard.component';
import { MapsComponent } from 'src/app/pages/maps/maps.component';
import { UserProfileComponent } from 'src/app/pages/user-profile/user-profile.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CreateProjectComponent } from 'src/app/pages/project/create-project/create-project.component';
import { CreateTaskComponent } from 'src/app/pages/task/create-task/create-task.component';
import { ListProjectComponent } from 'src/app/pages/project/list-project/list-project.component';
import { ListTaskComponent } from 'src/app/pages/task/list-task/list-task.component';
import { TaskUrgentComponent } from 'src/app/pages/task/urgent-task/urgent-task.component';
import { MatInputModule } from '@angular/material/input';
import { EditProjectComponent } from 'src/app/pages/project/edit-project/edit-project.component';
import { EditTaskComponent } from 'src/app/pages/task/edit-task/edit-task.component';
import { NotFoundComponent } from 'src/app/pages/not-found/not-found.component';
import { DashboardAcceuilComponent } from 'src/app/pages/dashboard-acceuil/dashboard-acceuil.component';
import { TasksUrgentComponent } from 'src/app/pages/task/urgent-tasks/urgent-tasks.component';
import { ListTasksComponent } from 'src/app/pages/task/list-tasks/list-tasks.component';
import { ListProjectsComponent } from 'src/app/pages/project/list-projects/list-projects.component';



@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    HttpClientModule,
    NgbModule,
    ClipboardModule,
    MatCardModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule

  ],
  declarations: [
    DashboardComponent,
    DashboardAcceuilComponent,
    UserProfileComponent,
    MapsComponent,
    CreateProjectComponent,
    CreateTaskComponent,
    ListProjectComponent,
    ListProjectsComponent,
    ListTaskComponent,
    ListTasksComponent,
    TaskUrgentComponent,
    TasksUrgentComponent,
    EditProjectComponent,
    EditTaskComponent,
    NotFoundComponent
  ]
})
export class AdminLayoutModule { }
