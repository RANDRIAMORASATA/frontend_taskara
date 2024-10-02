import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserModel } from '../../models/user.model';
import { ProjectModel } from '../../models/project.model';
import { TaskModel } from '../../models/task.model';
import { ProjectService } from '../../services/project/project-service.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.registerForm = this.fb.group({
      _id_user: ['', Validators.required],
      name_user: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mdp: ['', [Validators.required, Validators.minLength(6)]],
      confirm_mdp: ['', [Validators.required, Validators.minLength(6)]],
      infos_user: ['']
    });

  }

  onSubmit() {
    if (this.registerForm.valid) {
      const userData: UserModel = this.registerForm.value;
      console.log('User Data:', userData);
      // Appeler le service pour enregistrer l'utilisateur
    } else {
      console.log('Form is invalid');
    }
  }
}
