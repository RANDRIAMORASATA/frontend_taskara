import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { catchError, Observable, of } from 'rxjs';
import { UserModel } from 'src/app/models/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { UserResponse } from 'src/app/models/user-response.model';
import { AuthService } from 'src/app/services/auth/auth-service.service';
import { ValidatorService } from 'src/app/services/validators/validator.service';

type UserModelKeys = keyof UserModel;

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})

export class UserProfileComponent implements OnInit {
  user: UserModel | undefined;
  initialUser: UserModel;
  image_link: string | '';


  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private validators: ValidatorService

  ) {

  }

  ngOnInit() {
    this.userService.getUserConnected().subscribe(userConnected => {
      this.user = userConnected;
      this.initialUser = { ...userConnected };
      console.log(this.initialUser)
      this.image_link = this.user.image_link;
      console.log('User in user profile:', this.user);
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        console.error('Invalid file type. Please upload an image.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        this.image_link = e.target?.result as string;
        if (this.user) {
          this.user.image_link = this.image_link;
        }
        console.log('Image link updated:', this.image_link);
      };
      reader.readAsDataURL(file);
    }
  }


  private addIfChanged(property: UserModelKeys, userData: Partial<UserModel>) {
    if (this.user[property]?.trim() !== this.initialUser[property]?.trim()) {
      userData[property] = this.user[property] || '';
      console.log(`${property} changed:`, this.user[property]);
    }
  }

  updateUser() {
    if (this.user) {
      const userData: Partial<UserModel> = {};

      console.log('Current user data:', this.user);
      console.log('Initial user data:', this.initialUser);

      const userProperties: UserModelKeys[] = ['name_user', 'email', 'role', 'contract', 'adress', 'infos_user'];

      userProperties.forEach(property => {
        this.addIfChanged(property, userData);
      });

      if (this.user.image_link !== this.initialUser.image_link) {
        const fileExtension = this.user.image_link.split(';')[0].split('/')[1];
        const imageName = `assets/img/user_image/${this.user.name_user}-${Date.now()}.${fileExtension}`;
        userData.image_link = imageName;
      } else {
        userData.image_link = this.initialUser.image_link;
      }

      if (Object.keys(userData).length === 0) {
        console.warn('No changes detected.');
        return;
      }

      console.log('User data before update:', userData);

      this.userService.updateUser({ ...this.user, ...userData }).subscribe(
        response => {
          console.log('User updated successfully:', response);
          this.ngOnInit();
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
          this.authService.logout();
          this.router.navigate(['/login'])
        } else {
          console.error('Failed to delete user');
        }
      });
    }
  }

}
