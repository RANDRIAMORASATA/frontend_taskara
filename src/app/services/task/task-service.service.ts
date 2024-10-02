import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { ProjectModel } from 'src/app/models/project.model';
import { TaskModel } from 'src/app/models/task.model';

export interface TasksResponse {
  tasks: TaskModel[];
}
@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private apiUrl = 'http://localhost:8000/task';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  // Création d'une tâche
  createTask(task: TaskModel): Observable<TaskModel> {
    return this.http.post<TaskModel>(this.apiUrl, task);
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
  // Récupération de tous les projets
  getTasks(): Observable<TasksResponse> {
    return this.http.get<TasksResponse>(this.apiUrl, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }
}
