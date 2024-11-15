import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjectService, ProjectsResponse } from '../../../services/project/project-service.service';
import { ProjectModel } from '../../../models/project.model';
import { UserService } from 'src/app/services/user/user.service';
import { UserModel } from 'src/app/models/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.scss']
})
export class EditProjectComponent implements OnInit {
  projectForm: FormGroup;
  user: UserModel | undefined;
  _id_project: string | null = null;
  taskName: string = '';
  projects: ProjectModel[] = [];


  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this._id_project = this.route.snapshot.paramMap.get('_id_project');
    console.log('Project ID from route:', this._id_project);
    if (this._id_project) {
      this.fetchProject(this._id_project);
    } else {
      console.error('Project ID is missing');
    }

    // Initialisation du formulaire
    this.projectForm = this.fb.group({
      _id_project: [{ value: this._id_project, disabled: true }],
      name_project: ['', Validators.required],
      description_project: ['', Validators.required],
      status: ['', Validators.required],
      updatedAt: [{ value: new Date(), disabled: true }],
      deadline: ['', Validators.required],
      _user_id: this.user?._id_user || '',
      tasks: [[]]
    });

    this.userService.getUserConnected().subscribe(userConnected => {
      this.user = userConnected;
      console.log('user edit project:', userConnected);
      // Vous pouvez mettre à jour le formulaire avec l'ID utilisateur ici si nécessaire
    });



  }
  // Récupérationdu projet existant
  fetchProject(_id_project: string) {
    this.projectService.getProjectById(_id_project).subscribe(
      (response: { project: ProjectModel }) => {
        const project = response.project;
        console.log('Fetched project:', project);
        const formattedDate = formatDate(project.createdAt, 'yyyy-MM-dd', 'en-US');

        this.projectForm.patchValue({
          name_project: project.name_project,
          description_project: project.description_project,
          status: project.status,
          deadline: formattedDate,
          tasks: project.tasks || []
        });
        console.log('Form values after patching:', this.projectForm.value);
      },
      (error) => {
        console.error('Error retrieving project:', error);
      }
    );
  }



  onSubmit() {
    if (this.projectForm.valid) {

      console.log('Project ID for update:', this._id_project);
      const projectData: ProjectModel = {
        _id_project: this._id_project,
        name_project: this.projectForm.value.name_project,
        description_project: this.projectForm.value.description_project,
        updatedAt: new Date(),
        status: this.projectForm.value.status,
        deadline: this.projectForm.value.deadline,
        _user_id: this.user?._id_user || '',
        tasks: this.projectForm.value.tasks || []
      };

      console.log('Project data before update:', projectData);
      // Appel à l'API pour mettre à jour le projet
      this.projectService.updateProject(projectData).subscribe(
        response => {
          console.log('Project updated successfully:', response);
          this.router.navigate(['/list-project', projectData._user_id]);
        },
        error => {
          console.error('Error updating project:', error);
        }
      );
    } else {
      console.error('Form is invalid:');
      this.projectForm.markAllAsTouched();
    }
  }





}

