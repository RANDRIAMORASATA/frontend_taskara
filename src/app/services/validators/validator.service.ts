import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from '../auth/auth-service.service';
import { UserModel } from 'src/app/models/user.model';
import { jwtDecode } from 'jwt-decode';
import { UserResponse } from 'src/app/models/user-response.model';
import { AbstractControl, ValidatorFn } from '@angular/forms';


interface DecodedToken {
  idUser: string;
}
@Injectable({
  providedIn: 'root'
})
export class ValidatorService {

  constructor(
  ) {

  }
  imageValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const file = control.value;
      if (file && file.length) {
        const validExtensions = ['jpg', 'jpeg', 'png'];
        const fileExtension = file[0].name.split('.').pop()?.toLowerCase();
        const isValid = validExtensions.includes(fileExtension!);
        return isValid ? null : { invalidImage: { value: control.value } };
      }
      return null; // If no file is selected, consider it valid
    };
  }


}
