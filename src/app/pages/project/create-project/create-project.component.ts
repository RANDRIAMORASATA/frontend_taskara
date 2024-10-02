import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjectService } from '../../../services/project/project-service.service';
import { ProjectModel } from '../../../models/project.model';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.scss']
})
export class CreateProjectComponent implements OnInit {
  projectForm: FormGroup;

  constructor(private fb: FormBuilder, private projectService: ProjectService) { }

  ngOnInit(): void {
    this.projectForm = this.fb.group({
      _id_project: ['', Validators.required],
      name_project: ['', Validators.required],
      description_project: ['', Validators.required],
      status: ['', Validators.required],
      deadline: ['', Validators.required],
      _user_id: ['693'],
      tasks: [[]] // Optionnel si vous avez une logique de tâches plus complexe
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
      const project: ProjectModel = {
        _id_project: this.projectForm.value._id_project,
        name_project: this.projectForm.value.name_project,
        description_project: this.projectForm.value.description_project,
        status: this.projectForm.value.status,
        deadline: new Date(deadline.toISOString()),
        createdAt: new Date(),
        updatedAt: null,
        user: { _id_user: this.projectForm.value._user_id, name_user: 'John Doe' },
        tasks: [{ _id_task: '1001', name_task: 'Intégration des pages' }]
      };
      console.log('Project before sending:', project);

      this.projectService.createProject(project).subscribe({
        next: (response) => {
          console.log('Project created successfully', response);
        },
        error: (error) => {
          console.error('Error creating project', error);
          console.error('Server returned code', error.status, 'body was:', error.error);
        }
      });
    } else {
      console.log('Form is invalid');
      this.projectForm.markAllAsTouched();
    }
  }

}
