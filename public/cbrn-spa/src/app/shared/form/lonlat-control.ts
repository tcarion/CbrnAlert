import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";

let lonLatFormat = /^-?\d{1,3}[,|.]?\d*$/gm;

export class LonlatControl {
    // lonlat: FormGroup;

    // constructor() {
    //     this.lonlat = new FormGroup({
    //         lon: new FormControl(''),
    //         lat: new FormControl('')
    //     }, { validators: wrongLonLatValidator});
    // }
    lon = new FormControl('', wrongLonValidator);
    lat = new FormControl('', wrongLatValidator);
}

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

// export const wrongLonLatValidator: ValidatorFn = (control: AbstractControl) => {
//     const lon = control.get('lon');
//     const lat = control.get('lat');
    
//     if (lon && lat) {
//         if (!lon.value.match(lonLatFormat)) {
//           return { wrongFormat: { value: lon.value } };
//         }
//         if (!lat.value.match(lonLatFormat)) {
//             return { wrongFormat: { value: lat.value } };
//           }
//         if (parseFloat(lon.value) < -90. || parseFloat(lon.value)  > 90.) {
//           return { valOutOfBound: { value: lon.value } };
//         }
//         if (parseFloat(lat.value) < -180. || parseFloat(lat.value)  > 180.) {
//             return { valOutOfBound: { value: lat.value } };
//         }
//     }
//     return null;
// }