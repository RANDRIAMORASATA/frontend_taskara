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
import { TablesComponent } from 'src/app/pages/tables/tables.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CreateProjectComponent } from 'src/app/pages/project/create-project/create-project.component';
import { CreateTaskComponent } from 'src/app/pages/task/create-task/create-task.component';
import { ListProjectComponent } from 'src/app/pages/project/list-project/list-project.component';
import { ListTaskComponent } from 'src/app/pages/task/list-task/list-task.component';
import { DetailProjectComponent } from 'src/app/pages/project/detail-project/detail-project.component';

import { MatInputModule } from '@angular/material/input';



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
    UserProfileComponent,
    TablesComponent,
    MapsComponent,
    CreateProjectComponent,
    CreateTaskComponent,
    ListProjectComponent,
    ListTaskComponent,
    DetailProjectComponent,
  ]
})
export class AdminLayoutModule { }
