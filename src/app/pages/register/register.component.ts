import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserModel } from '../../models/user.model';
import { ProjectModel } from '../../models/project.model';
import { TaskModel } from '../../models/task.model';
import { ProjectService } from '../../services/project/project-service.service';
import { UserService } from 'src/app/services/user/user.service';
import { Router } from '@angular/router';
import { ValidatorService } from 'src/app/services/validators/validator.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  image_link: string | null = null;
  role: string | null = null;
  adress: string | null = null;
  contract: string | null = null;

  constructor(
    private fb: FormBuilder,
    private validators: ValidatorService,
    private router: Router,
    private userService: UserService) { }

  generateId(): string {
    return 'user_' + Math.random().toString(36).substr(2, 9);
  }
  ngOnInit() {
    const _id_user = this.generateId();
    this.registerForm = this.fb.group({
      _id_user: [{ value: _id_user, disabled: true }],
      name_user: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      image_link: [{ value: '', disabled: true }],
      role: [""],
      adress: [""],
      contract: [""],
      mdp: ['', [Validators.required, Validators.minLength(6)]],
      confirm_mdp: ['', [Validators.required, Validators.minLength(6)]],
      infos_user: ['A propos de vous']
    }, { validators: this.passwordMatchValidator });


  }
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('mdp')?.value;
    const confirmPassword = form.get('confirm_mdp')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onSubmit() {
    console.log('Form value before submission:', this.registerForm.value);

    // Trim whitespace
    this.registerForm.patchValue({
      mdp: this.registerForm.get('mdp')?.value.trim(),
      confirm_mdp: this.registerForm.get('confirm_mdp')?.value.trim()
    });

    if (this.registerForm.valid) {
      const userData = new FormData();
      // Set values for role, adress, and contract

      const fields = ['_id_user', 'name_user', 'email', 'role', 'adress', 'contract', 'mdp', 'confirm_mdp',];

      fields.forEach(field => {
        const value = this.registerForm.get(field)?.value;
        userData.append(field, value);
      });

      if (this.image_link) {
        const fileType = this.image_link.split(';')[0].split('/')[1]; //the file type
        const blob = this.dataURLtoBlob(this.image_link);
        const imageName = `assets/img/user_image/-${Date.now()}.${fileType}`; // the correct extension
        //userData.append('image', blob, imageName);
        userData.append('image_link', this.image_link);

      }

      console.log('User Data before sending:');
      userData.forEach((value, key) => {
        console.log(`${key}: ${value}`);
      });
      this.userService.registerUser(userData).subscribe(
        response => {
          console.log('User registered successfully:', response);
          this.router.navigate(['/login']);
        },
        error => {
          console.error('Error registering user:', error);
          alert('Une erreur est survenue lors de l\'enregistrement. Veuillez vérifier vos données.');
        }
      );
    } else {
      console.log('Form is invalid:', this.registerForm.errors);
    }
  }

  // Helper function to convert data URL to Blob
  dataURLtoBlob(dataURL: string) {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;  // Changez const en let ici
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.image_link = e.target?.result as string; // Obtenir le lien de l'image
        this.registerForm.patchValue({ image_link: this.image_link }); // Mettre à jour le champ image_link
        console.log('Image link updated:', this.image_link); // Vérifiez ici
      };
      reader.readAsDataURL(file);
      // Convertir l'image en Data URL
    }
  }


}
