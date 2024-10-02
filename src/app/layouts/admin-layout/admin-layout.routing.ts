import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';

import { MapsComponent } from '../../pages/maps/maps.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { TablesComponent } from '../../pages/tables/tables.component';
import { CreateTaskComponent } from 'src/app/pages/task/create-task/create-task.component';
import { CreateProjectComponent } from 'src/app/pages/project/create-project/create-project.component';
import { ListProjectComponent } from 'src/app/pages/project/list-project/list-project.component';
import { ListTaskComponent } from 'src/app/pages/task/list-task/list-task.component';


export const AdminLayoutRoutes: Routes = [
  { path: 'dashboard/:userId', component: DashboardComponent },
  { path: 'user-profile/:email', component: UserProfileComponent },
  { path: 'tables/:userId', component: TablesComponent },
  { path: 'maps/:userId', component: MapsComponent },
  { path: 'create-task/:userId', component: CreateTaskComponent },
  { path: 'create-project/:userId', component: CreateProjectComponent },
  { path: 'list-project/:userId', component: ListProjectComponent },
  { path: 'list-task/:userId', component: ListTaskComponent },
];
