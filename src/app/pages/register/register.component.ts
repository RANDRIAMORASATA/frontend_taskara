import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserModel } from '../../models/user.model';
import { ProjectModel } from '../../models/project.model';
import { TaskModel } from '../../models/task.model';
import { ProjectService } from '../../services/project/project-service.service';
import { UserService } from 'src/app/services/user/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private userService: UserService) { }

  generateId(): string {
    return 'user_' + Math.random().toString(36).substr(2, 9);
  }
  ngOnInit() {
    const _id_user = this.generateId();
    this.registerForm = this.fb.group({
      _id_user: [{ value: _id_user, disabled: true }],
      name_user: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mdp: ['', [Validators.required, Validators.minLength(6)]],
      confirm_mdp: ['', [Validators.required, Validators.minLength(6)]],
      infos_user: ['']
    }, { validators: this.passwordMatchValidator });


  }
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('mdp')?.value;
    const confirmPassword = form.get('confirm_mdp')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onSubmit() {
    this.registerForm.patchValue({
      mdp: this.registerForm.get('mdp')?.value.trim(),
      confirm_mdp: this.registerForm.get('confirm_mdp')?.value.trim()
    });
    if (this.registerForm.valid) {
      const userData: UserModel = {
        ...this.registerForm.value,

      };
      console.log('User Data:', userData);
      this.userService.registerUser(userData).subscribe(
        response => {
          console.log('User registered successfully:', response);
          this.router.navigate(['/login']);
          // Handle successful registration (e.g., redirect, show a message)
        },
        error => {
          console.error('Error registering user:', error);
          // Afficher un message d'erreur à l'utilisateur
          alert('Une erreur est survenue lors de l\'enregistrement. Veuillez vérifier vos données.');
        }
      );
    } else {
      console.log('Form value:', this.registerForm.value);
      console.log('Form controls:', this.registerForm.controls);

      // Log individual control statuses
      Object.keys(this.registerForm.controls).forEach(control => {
        const controlErrors = this.registerForm.get(control)?.errors;
        if (controlErrors) {
          console.log(`Control ${control} errors:`, controlErrors);
        }
      });

      console.log('Form is invalid:', this.registerForm.errors);
    }
  }
}
