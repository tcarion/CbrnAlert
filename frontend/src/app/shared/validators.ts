import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

let lonLatFormat = /^-?\d{1,3}[,|.]?\d*$/gm;

// export function wrongLatValidator(): ValidatorFn {
//   return (control: AbstractControl): { [key: string]: any } | null => {
//     const val = control.value;
    
//     if (!val.match(lonLatFormat)) {
//       return { wrongFormat: { value: val } };
//     }
//     if (parseFloat(val) < -90. || parseFloat(val)  > 90.) {
//       return { valOutOfBound: { value: val } };
//     }
//     return null;
//   };
// }


// export function wrongLonValidator(): ValidatorFn {
//     return (control: AbstractControl): { [key: string]: any } | null => {
//       const val = control.value;
      
//       if (!val.match(lonLatFormat)) {
//         return { wrongFormat: { value: val } };
//       }
//       if (parseFloat(val) < -180. || parseFloat(val)  > 180.) {
//         return { valOutOfBound: { value: val } };
//       }
//       return null;
//     };
//   }

export function wrongLatValidator(control: AbstractControl) : ValidationErrors | null {
    const val = control.value;
    
    if (!val.match(lonLatFormat)) {
      return { wrongFormat: { value: val } };
    }
    if (parseFloat(val) < -90. || parseFloat(val)  > 90.) {
      return { valOutOfBound: { value: val } };
    }
    return null;
}

export function wrongLonValidator(control: AbstractControl) : ValidationErrors | null {
      const val = control.value;
      
      if (!val.match(lonLatFormat)) {
        return { wrongFormat: { value: val } };
      }
      if (parseFloat(val) < -180. || parseFloat(val)  > 180.) {
        return { valOutOfBound: { value: val } };
      }
      return null;
  }