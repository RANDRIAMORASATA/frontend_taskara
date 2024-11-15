import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService, ProjectsResponse } from 'src/app/services/project/project-service.service';
import { UserService } from 'src/app/services/user/user.service';
import { ProjectModel } from 'src/app/models/project.model';
import { UserModel } from 'src/app/models/user.model';

@Component({
  selector: 'app-update-project',
  templateUrl: './list-projects.component.html',
  styleUrls: ['./list-projects.component.scss']
})
export class ListProjectsComponent implements OnInit {
  projects: ProjectModel[] = [];
  filteredProjects: ProjectModel[] = [];
  searchTerm: string = '';
  user: UserModel | undefined;

  constructor(
    private projectService: ProjectService,
    private router: Router,
    private userService: UserService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadProjects();
    this.projectService.projects$.subscribe((projects) => {
      this.projects = projects;
      this.filteredProjects = this.projects;
      console.log('Projects loaded in list:', this.projects);
    });

    this.userService.getUserConnected().subscribe(userConnected => {
      this.user = userConnected;
      console.log('User in list project:', this.user);
    });
  }

  loadProjects(): void {
    this.projectService.getProjects().subscribe(
      (response: ProjectsResponse) => { // new interface
        this.projects = response.projects;
        this.filteredProjects = this.projects;
        console.log('Received projects:', this.projects); // Log the received projects
        this.cd.detectChanges(); // OnPush strategy

      },
      (error) => {
        console.error('Error fetching projects', error);
      }
    );
  }
  filterProjects(): void {
    this.filteredProjects = this.projects.filter(project =>
      project.name_project.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      project.description_project.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  redirectToCreateProject(_id_user) {
    this.router.navigate(['/create-project', _id_user]);
  }

  redirectToEditProject(_id_user, _project_id) {
    this.router.navigate(['/edit-project', _id_user, _project_id]);
  }

  onDeleteProject(projectId: string) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      this.projectService.deleteProject(projectId).subscribe(response => {
        if (response) {
          console.log('Project deleted successfully:', response);
          this.projects = this.projects.filter(project => project._id_project !== projectId);
          this.filteredProjects = this.filteredProjects.filter(project => project._id_project !== projectId);
        } else {
          console.error('Failed to delete project');
        }
      });
    }
  }
}
