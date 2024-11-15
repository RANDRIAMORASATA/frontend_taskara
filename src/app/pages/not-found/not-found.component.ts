import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserModel } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})

export class NotFoundComponent implements OnInit {

  user: UserModel | undefined;
  constructor(
    private userService: UserService,
    private router: Router
  ) {

  }

  ngOnInit() {
    this.userService.getUserConnected().subscribe(userConnected => {
      this.user = userConnected;
      console.log('User in 404:', this.user);
    });
  }
  redirectDashboard(_id_user) {
    this.router.navigate(['/dashboard', _id_user]);
  }



}
