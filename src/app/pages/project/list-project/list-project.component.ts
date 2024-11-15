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
    // this.loadProjects();
    this.userService.getUserConnected().subscribe(userConnected => {
      this.user = userConnected;
      console.log('User in list project:', this.user);
      if (this.user) {
        this.loadProjects(this.user._id_user);  // Utilise l'id de l'utilisateur pour charger ses projets
      }
    });
  }

  loadProjects(_id_user: string): void {
    this.projectService.getProjectsByUser(_id_user).subscribe(
      (response: ProjectsResponse) => {
        this.projects = response.projects;
        this.filteredProjects = this.projects; // Initialisation  avec tous les projets
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
  redirectToCreateProject(_id_user) {
    this.router.navigate(['/create-project', _id_user]);
  }
  redirectToEditProject(_id_user, _project_id) {
    this.router.navigate(['/edit-project', _id_user, _project_id]);
  }
  onDeleteProject(projectId: string) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet projet ?')) {
      this.projectService.deleteProject(projectId).subscribe(response => {
        if (response) {
          console.log('Project deleted successfully:', response);
          //  liste des projets mis à jour
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
