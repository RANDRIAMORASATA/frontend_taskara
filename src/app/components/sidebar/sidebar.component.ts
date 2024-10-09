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
  { path: '/dashboard/:idUser', title: 'Dashboard', icon: 'ni-tv-2 text-primary', class: '' },
  { path: '/user-profile/:idUser', title: 'User profile', icon: 'ni-single-02 text-yellow', class: '' },
  { path: '/list-project/:idUser', title: 'Project', icon: 'ni ni-fat-add text-primary', class: '' },
  { path: '/list-task/:idUser', title: 'Task', icon: 'ni-key-25 text-warning', class: '' },

];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public menuItems: any[];
  public isCollapsed = true;

  user: UserModel | undefined;

  constructor(private router: Router,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.router.events.subscribe(() => {
      this.isCollapsed = true;
    });
    this.userService.getUserConnected().subscribe(userConnected => {
      this.user = userConnected;
      console.log('user sidebar:', this.user)
      this.menuItems = this.getRoutes();
    });

  }
  getRoutes() {
    return this.menuItems.map(item => {
      return {
        ...item,
        path: item.path.replace(':idUser', this.user?._id_user || '')
      };
    });
  }
}

