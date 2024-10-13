import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';

import { MapsComponent } from '../../pages/maps/maps.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { TablesComponent } from '../../pages/tables/tables.component';
import { CreateTaskComponent } from 'src/app/pages/task/create-task/create-task.component';
import { CreateProjectComponent } from 'src/app/pages/project/create-project/create-project.component';
import { ListProjectComponent } from 'src/app/pages/project/list-project/list-project.component';
import { ListTaskComponent } from 'src/app/pages/task/list-task/list-task.component';
import { EditProjectComponent } from 'src/app/pages/project/edit-project/edit-project.component';
import { EditTaskComponent } from 'src/app/pages/task/edit-task/edit-task.component';


export const AdminLayoutRoutes: Routes = [
  { path: 'dashboard/:_id_user', component: DashboardComponent },
  { path: 'user-profile/:_id_user', component: UserProfileComponent },
  { path: 'tables/:_id_user', component: TablesComponent },
  { path: 'maps/:_id_user', component: MapsComponent },
  { path: 'create-task/:_id_user', component: CreateTaskComponent },
  { path: 'create-project/:_id_user', component: CreateProjectComponent },
  { path: 'list-project/:_id_user', component: ListProjectComponent },
  { path: 'list-task/:_id_user', component: ListTaskComponent },
  { path: 'edit-project/:_id_user/:_id_project', component: EditProjectComponent },
  { path: 'edit-task/:_id_user/:_id_task', component: EditTaskComponent },
];
