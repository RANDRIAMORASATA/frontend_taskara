import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { ProjectModel } from 'src/app/models/project.model';

export interface ProjectsResponse {
  projects: ProjectModel[];
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private apiUrl = 'http://localhost:8000/project';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  // Méthode pour récupérer les projets par utilisateur
  getProjectsByUser(userId: string): Observable<ProjectModel[]> {
    return this.http.get<ProjectModel[]>(`${this.apiUrl}/${userId}`, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  createProject(project: ProjectModel): Observable<any> {
    return this.http.post<any>(this.apiUrl, project, this.httpOptions).pipe(
      catchError(this.handleError)
    );
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

  getProjects(): Observable<ProjectsResponse> {
    return this.http.get<ProjectsResponse>(this.apiUrl, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }


}
