import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, of, throwError } from 'rxjs';
import { ProjectModel } from 'src/app/models/project.model';
import { AuthService } from '../auth/auth-service.service';

export interface ProjectsResponse {
  projects: ProjectModel[];

}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private projectSubject = new BehaviorSubject<ProjectModel | undefined>(undefined);
  private projectUrl = 'http://localhost:8000/project';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(
    private http: HttpClient,
    private authService: AuthService) { }

  // Méthode pour récupérer les projets par utilisateur
  getProjectsByUser(userId: string): Observable<ProjectModel[]> {
    return this.http.get<ProjectModel[]>(`${this.projectUrl}/${userId}`, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  createProject(project: ProjectModel): Observable<any> {
    return this.http.post(this.projectUrl, project, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      errorMessage = `Server-side error: ${error.status} ${error.message}`;
    }
    console.error(errorMessage); // Log the error to the console
    // Optionally, display user-friendly error messages to the UI
    return throwError(errorMessage);
  }
  setProject(project: ProjectModel) {
    this.projectSubject.next(project);
    localStorage.setItem('currentUser', JSON.stringify(project)); // Sauvegarde dans localStorage
  }

  getProject(): ProjectModel | undefined {
    return this.projectSubject.value;
  }

  getProjects(): Observable<ProjectsResponse> {
    return this.http.get<ProjectsResponse>(this.projectUrl, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }
  deleteProject(projectId: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
    return this.http.delete(`${this.projectUrl}/${projectId}`, { headers })
      .pipe(
        catchError(error => {
          console.error('Error deleting user:', error);
          return of(null); // Ou utilisez throwError pour une gestion des erreurs plus poussée
        })
      );
  }


}
