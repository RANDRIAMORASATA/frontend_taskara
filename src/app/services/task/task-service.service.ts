import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { TaskModel } from 'src/app/models/task.model';
import { AuthService } from '../auth/auth-service.service';

export interface TasksResponse {
  tasks: TaskModel[];
}
@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasksSubject = new BehaviorSubject<TaskModel | undefined>(undefined);
  private taskUrl = 'http://localhost:8000/task';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  // Création d'une tâche
  createTask(task: TaskModel): Observable<any> {
    return this.http.post(this.taskUrl, task, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  //update task
  updateTask(taskId: string, task: TaskModel): Observable<any> {
    return this.http.put(`${this.taskUrl}/${taskId}`, task, {
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
  setTask(task: TaskModel) {
    this.tasksSubject.next(task);
    localStorage.setItem('currentTask', JSON.stringify(task)); // Sauvegarde dans localStorage
  }

  getProject(): TaskModel | undefined {
    return this.tasksSubject.value;
  }

  // Méthode pour récupérer les tâches par utilisateur
  getTasksByUser(userId: string): Observable<TasksResponse> {
    const token = this.authService.getToken(); // Récupère le token JWT
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<TasksResponse>(`${this.taskUrl}/${userId}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  getUrgentTasksByUser(userId: string): Observable<TasksResponse> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<TasksResponse>(`${this.taskUrl}/urgent/${userId}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }
  // Récupération de tous les taches
  getTasks(): Observable<TasksResponse> {
    return this.http.get<TasksResponse>(this.taskUrl, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }
  // Méthode pour récupérer les projets par utilisateur
  getTaskById(_id_task: string): Observable<{ task: TaskModel }> {
    return this.http.get<{ task: TaskModel }>(`http://localhost:8000/task/${_id_task}`);
  }

  deleteTask(taskId: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
    return this.http.delete(`${this.taskUrl}/${taskId}`, { headers })
      .pipe(
        catchError(error => {
          console.error('Error deleting user:', error);
          return of(null);
        })
      );
  }
  editTask(taskData: TaskModel): Observable<any> {
    return this.http.put(`http://localhost:8000/task/${taskData._id_task}`, taskData);
  }











}
