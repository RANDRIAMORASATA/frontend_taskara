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
  private projectsSubject: BehaviorSubject<ProjectModel[]> = new BehaviorSubject<ProjectModel[]>([]);

  public projects$: Observable<ProjectModel[]> = this.projectsSubject.asObservable();
  constructor(
    private http: HttpClient,
    private authService: AuthService) { }

  getProjectsByUser(userId: string): Observable<ProjectsResponse> {
    const token = this.authService.getToken(); // Récupèration du token JWT
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<ProjectsResponse>(`${this.projectUrl}/${userId}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }
  getProjects(): Observable<ProjectsResponse> {
    return this.http.get<ProjectsResponse>(this.projectUrl, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }
  getProjectById(_id_project: string): Observable<{ project: ProjectModel }> {
    return this.http.get<{ project: ProjectModel }>(`http://localhost:8000/project/${_id_project}`);
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
    console.error(errorMessage);
    return throwError(errorMessage);
  }
  setProject(project: ProjectModel) {
    this.projectSubject.next(project);
    localStorage.setItem('currentProject', JSON.stringify(project)); // Sauvegarde dans localStorage
  }

  getProject(): ProjectModel | undefined {
    return this.projectSubject.value;
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
  updateProject(projectData: ProjectModel): Observable<any> {
    return this.http.put(`http://localhost:8000/project/${projectData._id_project}`, projectData);
  }

  loadProjects(): void {
    this.getProjects().subscribe(
      (response) => {
        this.projectsSubject.next(response.projects); //projet mis à jour
      },
      (error) => {
        console.error('Error fetching projects', error);
      }
    );
  }

}
