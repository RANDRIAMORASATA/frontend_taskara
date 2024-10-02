import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
interface DecodedToken {
  idUser: string;
  // Ajoutez d'autres propriétés si nécessaire en fonction de votre token
}
@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private loginUrl = 'http://localhost:8000/login';

  constructor(private http: HttpClient, private router: Router) { }

  setToken(token: string): void {
    if (token) {
      localStorage.setItem('token', token);
      console.log('Token stored:', token);
    } else {
      console.error('Attempted to store an undefined token');
    }
  }

  getToken(): string | null {
    const token = localStorage.getItem('token');
    console.log('Retrieved Token:', token);
    return token;
  }

  decodeToken(): any {
    const token = this.getToken();
    if (token) {
      try {
        return jwtDecode<DecodedToken>(token);
      } catch (error) {
        console.error('Error decoding token:', error);
        return null;
      }
    }
    return null;
  }

  login(email: string, password: string): Observable<any> {
    console.log('Making login request with:', { email, password });
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post<{ token?: string }>(this.loginUrl, { email, mdp: password }, { headers }).pipe(
      map(response => {
        console.log('Response from server:', response);
        const token = response['token'];
        if (token) {
          this.setToken(token);
          console.log('Token stored:', token);
        } else {
          console.error('No token received from server.');
        }
        return response;
      }),
      catchError(error => {
        console.error('Login error:', error);
        return throwError(() => new Error(error.error.message || 'Login failed'));
      })
    );
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getUserIdFromToken(): string | null {
    const decodedToken = this.decodeToken();
    const userId = decodedToken ? decodedToken.id : null;
    console.log('User ID from token:', userId);
    return userId;
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
