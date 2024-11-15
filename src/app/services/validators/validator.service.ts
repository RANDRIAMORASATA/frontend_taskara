import { Injectable } from '@angular/core';
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
      return null;
    };
  }


}
