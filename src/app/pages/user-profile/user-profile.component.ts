import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { catchError, Observable, of } from 'rxjs';
import { UserModel } from 'src/app/models/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { UserResponse } from 'src/app/models/user-response.model';
import { AuthService } from 'src/app/services/auth/auth-service.service';


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  user: UserModel | undefined;
  initialUser: UserModel;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService

  ) {

  }

  ngOnInit() {
    this.userService.getUserConnected().subscribe(userConnected => {
      this.user = userConnected;
      console.log('User in user profile:', this.user);
    });
  }


  updateUser() {
    if (this.user) {
      const userData: Partial<UserModel> = {};

      console.log('Current user data:', this.user);
      console.log('Initial user data:', this.initialUser);

      // Comparaisons
      if (this.user.name_user?.trim() !== this.initialUser.name_user?.trim()) {
        userData.name_user = this.user.name_user;
        console.log('NameUser changed:', this.user.name_user);
      }

      if (this.user.email?.trim() !== this.initialUser.email?.trim()) {
        userData.email = this.user.email;
        console.log('Email changed:', this.user.email);
      }

      if (this.user.infos_user?.trim() !== this.initialUser.infos_user?.trim()) {
        userData.infos_user = this.user.infos_user;
        console.log('InfosUser changed:', this.user.infos_user);
      }

      if (Object.keys(userData).length === 0) {
        console.warn('No changes detected.');
        return;
      }

      console.log('User data before update:', userData);

      this.userService.updateUser({ ...this.user, ...userData }).subscribe(
        response => {
          console.log('User updated successfully:', response);
        },
        error => {
          console.error('Error updating user:', error);
        }
      );
    } else {
      console.warn('No user to update.');
    }
  }

  onDeleteUser(userId: string) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      this.userService.deleteUser(userId).subscribe(response => {
        if (response) {
          console.log('User deleted successfully:', response);
          this.authService.logout(); // Déconnexion automatique
          this.router.navigate(['/login'])
          // Mettez à jour votre UI ou redirigez l'utilisateur
        } else {
          console.error('Failed to delete user');
        }
      });
    }
  }

}
