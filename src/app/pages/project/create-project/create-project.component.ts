import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjectService } from '../../../services/project/project-service.service';
import { ProjectModel } from '../../../models/project.model';
import { UserService } from 'src/app/services/user/user.service';
import { UserModel } from 'src/app/models/user.model';
import { TaskModel } from '../../../models/task.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.scss']
})
export class CreateProjectComponent implements OnInit {
  projectForm: FormGroup;
  user: UserModel | undefined;

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private userService: UserService,
    private router: Router) { }
  generateId(): string {
    return 'project_' + Math.random().toString(36).substr(2, 9);
  }
  ngOnInit(): void {

    const _id_project = this.generateId();
    this.projectForm = this.fb.group({
      _id_project: [{ value: _id_project, disabled: true }],
      name_project: ['', Validators.required],
      description_project: ['', Validators.required],
      status: ['', Validators.required],
      deadline: ['', Validators.required],
      _user_id: this.user?._id_user || '',
      tasks: [[]]
    });
    this.userService.getUserConnected().subscribe(userConnected => {
      this.user = userConnected;
      //this.projectForm.patchValue({ _user_id: this.user?._id_user });
      console.log('user create project:', userConnected)
    });
  }


  onSubmit() {
    console.log('Form values:', this.projectForm.value);

    const deadline = new Date(this.projectForm.value.deadline as string);
    if (isNaN(deadline.getTime())) {
      console.error('Invalid date');
      return;
    }

    if (this.projectForm.valid) {
      const projectData: ProjectModel = {
        _id_project: this.projectForm.value._id_project, // Inclure _id_project
        name_project: this.projectForm.value.name_project,
        description_project: this.projectForm.value.description_project,
        status: this.projectForm.value.status,
        deadline: this.projectForm.value.deadline, // Assurez-vous que le format de la date est correct
        _user_id: this.user?._id_user || '', // Assurez-vous que _user_id est bien défini
        tasks: this.projectForm.value.tasks || [] // Inclure les tâches, même si elles sont vides
      };
      console.log('ProjectData:', projectData);
      const requestData = {
        ...projectData,
        _user_id: this.user?._id_user || '',
      };
      console.log('requestData:', requestData);

      this.projectService.createProject(requestData).subscribe({
        next: (response) => {
          console.log('Project created successfully:', response);
          this.router.navigate(['/list-project', this.user?._id_user]);
        },
        error: (error) => {
          console.error('Error creating project:', error);
          alert('Une erreur est survenue lors de l\'enregistrement. Veuillez vérifier vos données.');
        }
      });
    } else {
      console.log('Form is invalid');
      this.projectForm.markAllAsTouched();
    }
  }


}
