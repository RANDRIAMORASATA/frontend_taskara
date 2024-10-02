import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { UserResponse } from 'src/app/models/user-response.model';
import { UserModel } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user/user.service';

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}
export const ROUTES: RouteInfo[] = [
  { path: '/dashboard/:email', title: 'Dashboard', icon: 'ni-tv-2 text-primary', class: '' },
  { path: '/user-profile/:email', title: 'User profile', icon: 'ni-single-02 text-yellow', class: '' },
  { path: '/list-project/:email', title: 'Project', icon: 'ni ni-fat-add text-primary', class: '' },
  { path: '/list-task/:email', title: 'Task', icon: 'ni-key-25 text-warning', class: '' },

];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public menuItems: any[];
  public isCollapsed = true;
  public userName: string | undefined;
  public email: string | undefined;
  public userId: string | null = null;
  user$: Observable<UserModel | UserResponse> = of();
  user: UserModel;
  constructor(private router: Router,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.user = this.userService.getUser();
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.router.events.subscribe(() => {
      this.isCollapsed = true;
    });

  }
  getRoutes() {
    return this.menuItems.map(item => {
      return {
        ...item,
        path: item.path.replace(':email', this.email || '')
      };
    });
  }
}

