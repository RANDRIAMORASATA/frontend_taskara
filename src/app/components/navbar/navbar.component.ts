import { Component, OnInit, ElementRef } from '@angular/core';
import { ROUTES } from '../sidebar/sidebar.component';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth-service.service';
import { UserService } from 'src/app/services/user/user.service';
import { UserModel } from 'src/app/models/user.model';
import { catchError, Observable, of } from 'rxjs';
import { off } from 'process';
import { UserResponse } from 'src/app/models/user-response.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  public focus;
  public listTitles: any[];
  public location: Location;
  user$: Observable<UserModel | UserResponse> = of();
  user: UserModel;
  constructor(location: Location, private element: ElementRef, private router: Router, private authService: AuthService, private userService: UserService) {
    this.location = location;
  }

  ngOnInit() {
    this.user = this.userService.getUser();
    console.log("*****************", this.user)
    this.listTitles = ROUTES.filter(listTitle => listTitle);
    this.user$ = this.userService.getUserData().pipe(
      catchError(err => {
        console.error('Error fetching user data', err);
        return of(undefined);
      })
    );

  }
  getTitle() {
    var titlee = this.location.prepareExternalUrl(this.location.path());
    if (titlee.charAt(0) === '#') {
      titlee = titlee.slice(1);
    }

    for (var item = 0; item < this.listTitles.length; item++) {
      if (this.listTitles[item].path === titlee) {
        return this.listTitles[item].title;
      }
    }
    return 'Dashboard';
  }
  logout() {
    this.authService.logout();
  }

}
