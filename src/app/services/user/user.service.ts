import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from '../auth/auth-service.service';
import { UserModel } from 'src/app/models/user.model';
import { jwtDecode } from 'jwt-decode';
import { UserResponse } from 'src/app/models/user-response.model';


interface DecodedToken {
  idUser: string;
}
@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userUrl = 'http://127.0.0.1:8000/user';
  private userSubject = new BehaviorSubject<UserModel | undefined>(undefined);
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) { }

  getUserData(): Observable<UserModel | undefined> {
    const token = this.authService.getToken();

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<UserModel>(this.userUrl, { headers }).pipe(
      map(user => user), // L'utilisateur est directement retourné
      catchError(error => {
        console.error('Error fetching user data:', error);
        return of(undefined);
      })
    );
  }

  getUserDataByEmail(email: string): Observable<UserResponse | undefined> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
    return this.http.get<UserResponse>(`${this.userUrl}/email/${email}`, { headers }).pipe(
      catchError(error => {
        console.error('Error fetching user data by email:', error);
        return of(undefined);
      })
    );
  }


  registerUser(userData: UserModel): Observable<any> {
    return this.http.post(this.userUrl, userData);
  }

  setUser(user: UserModel) {
    this.userSubject.next(user);
    localStorage.setItem('currentUser', JSON.stringify(user)); // Sauvegarde dans localStorage
  }

  getUser(): UserModel | undefined {
    return this.userSubject.value;
  }

  private loadUserFromLocalStorage() {
    const user = localStorage.getItem('currentUser');
    if (user) {
      this.userSubject.next(JSON.parse(user)); // Charger l'utilisateur depuis localStorage
    }
  }

}
