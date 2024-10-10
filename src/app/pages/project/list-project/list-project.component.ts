import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectModel } from 'src/app/models/project.model';
import { UserModel } from 'src/app/models/user.model';
import { FilterService } from 'src/app/services/filter/filter.service';
import { ProjectService, ProjectsResponse } from 'src/app/services/project/project-service.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-update-project',
  templateUrl: './list-project.component.html',
  styleUrls: ['./list-project.component.scss']
})
export class ListProjectComponent implements OnInit {
  projects: ProjectModel[] = [];
  filteredProjects: ProjectModel[] = [];
  searchTerm: string = '';
  user: UserModel | undefined;

  constructor(
    private projectService: ProjectService,
    private cd: ChangeDetectorRef,
    private filterService: FilterService,
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.loadProjects();
    this.userService.getUserConnected().subscribe(userConnected => {
      this.user = userConnected;
      console.log('User in list project:', this.user);
    });
  }

  loadProjects(): void {
    this.projectService.getProjects().subscribe(
      (response: ProjectsResponse) => {
        this.projects = response.projects;
        this.filteredProjects = this.projects; // Initialiser avec tous les projets
        this.cd.detectChanges();
        console.log('Received projects:', this.projects);
      },
      (error) => {
        console.error('Error fetching projects', error);
      }
    );
  }

  filterProjects(): void {
    this.filteredProjects = this.filterService.filterItems(this.projects, this.searchTerm, ['name_project', 'description_project']);
  }
  redirectToCreateProject() {
    this.router.navigate(['/create-project/:userName']);
  }
  onDeleteProject(projectId: string) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet projet ?')) {
      this.projectService.deleteProject(projectId).subscribe(response => {
        if (response) {
          console.log('Project deleted successfully:', response);
          // Met à jour la liste des projets
          this.projects = this.projects.filter(project => project._id_project !== projectId);
          this.filteredProjects = this.filteredProjects.filter(project => project._id_project !== projectId);
          this.cd.detectChanges();
        } else {
          console.error('Failed to delete project');
        }
      });
    }
  }

}
