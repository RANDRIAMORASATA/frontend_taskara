import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { catchError, Observable, of } from 'rxjs';
import { UserModel } from 'src/app/models/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { UserResponse } from 'src/app/models/user-response.model';


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  user$: Observable<UserModel | UserResponse> = of();
  user: UserModel;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.user = this.userService.getUser(); // Récupérez l'utilisateur
    if (!this.user) {
      // Si l'utilisateur n'est pas trouvé dans le service, vous pouvez gérer ce cas
      console.warn('Aucun utilisateur trouvé. Vérifiez la connexion.');
    }
    console.log('User in user profile:', this.user);
  }
  private isUserModel(response: any): response is UserModel {
    return response && typeof response._id_user === 'string';
  }

  updateUser() {
    // Logique pour mettre à jour l'utilisateur
    console.log('Utilisateur mis à jour:', this.user);
  }
}
