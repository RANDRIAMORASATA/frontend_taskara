import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth-service.service';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { UserService } from 'src/app/services/user/user.service';
import { UserModel } from 'src/app/models/user.model';

interface DecodedToken {
  iat?: number;
  exp?: number;
  roles?: string[];
  username?: string;
  email: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email: string;
  password: string;

  constructor(private authService: AuthService, private router: Router, private userService: UserService) { }

  login() {
    console.log('Login attempt with:', this.email);
    this.authService.login(this.email, this.password).subscribe(response => {
      if (response.token) {
        // Store the token
        this.authService.setToken(response.token);

        // Extract userId from the token
        const email = this.extractUserIdFromToken(response.token);
        console.log('=================', email)

        if (email) {
          // Redirect to dashboard with userId

          this.userService.getUserDataByEmail(this.email).subscribe(userResponse => {
            console.log('User data response:', userResponse);
            if (userResponse && userResponse.user) {
              const user: UserModel = userResponse.user; // Assurancede l user userResponse.user correspond à UserModel
              this.userService.setUser(user); // Stockage de  l'utilisateur dans le service
              const idUser = userResponse.user.idUser;

              console.log("---------------user ID récupéré ------------------", idUser);
              console.log("---------------user récupéré ------------------", user);
              this.router.navigate(['/dashboard', idUser]);
            }
          })
        } else {
          console.error('Failed to extract userId from token');
        }
      } else {
        console.error('Login failed', response);
      }
    });
  }

  private extractUserIdFromToken(token: string): string | null {
    try {
      const decodedToken = jwtDecode<DecodedToken>(token);
      console.log('Decoded token:', decodedToken); // Assurez-vous que les informations sont correctes
      return decodedToken.username ?? null; // Utilisez 'username' au lieu de 'id'
    } catch (error) {
      console.error('Failed to decode token', error);
      return null;
    }
  }
}
