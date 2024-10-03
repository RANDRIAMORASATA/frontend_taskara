import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ProjectModel } from 'src/app/models/project.model';
import { ProjectService, ProjectsResponse } from 'src/app/services/project/project-service.service';

@Component({
  selector: 'app-update-project',
  templateUrl: './list-project.component.html',
  styleUrls: ['./list-project.component.scss']
})
export class ListProjectComponent implements OnInit {
  projects: ProjectModel[] = [];
  constructor(
    private projectService: ProjectService,
    private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.loadProjects();
  }
  loadProjects(): void {
    this.projectService.getProjects().subscribe(
      (response: ProjectsResponse) => { // Use the new interface
        this.projects = response.projects; // Now this should work
        this.cd.detectChanges(); // Optional for OnPush strategy
        console.log('Received projects:', this.projects); // Log the received projects
      },
      (error) => {
        console.error('Error fetching projects', error);
      }
    );
  }

}
