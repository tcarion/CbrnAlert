import { AbstractControl, NgControl, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { Component, forwardRef, OnDestroy, Optional, Self } from '@angular/core';
import { first, skip } from 'rxjs/operators';
import { MapState, MapAction } from 'src/app/core/state/map.state';
import { GeoPoint } from 'src/app/core/api/models';
import { ControlValueAccessor, FormControl, FormGroup } from '@angular/forms';
import { ControlsOf } from 'src/app/shared/form/controls-of';
// interface Locations {
//     locations: FormArray<GeoPoint>
// }
@Component({
    selector: 'app-location',
    templateUrl: './location.component.html',
    styleUrls: ['./location.component.scss'],
    providers: [
      {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => LocationComponent),
        multi: true,
      },
      {
        provide: NG_VALIDATORS,
        useExisting: forwardRef(() => LocationComponent),
        multi: true,
      },
    ],
})
export class LocationComponent implements ControlValueAccessor, OnDestroy, Validator {

    value: GeoPoint = { lon: 0., lat: 0. };


    form = new FormGroup({
        lon: new FormControl(0, {nonNullable: false, validators: [wrongLonValidator, Validators.required]}),
        lat: new FormControl(0, {nonNullable: false, validators: [wrongLatValidator, Validators.required]})
    })

    markerSub: Subscription;
    statusSub: Subscription;

    touched = false;

    disabled = false;

    onChange = (value: GeoPoint) => { };

    onTouched = () => { };

    onValidationChange = () => {};

    onChangeSubs: Subscription[] = [];

    @Select(MapState.userPoint) marker$: Observable<GeoPoint>;

    constructor(
        public store: Store,
        // @Self() @Optional() private control: NgControl
    ) {
      // this.control.valueAccessor = this;
    }

    // public get invalid(): boolean {
    //   return this.form.invalid
    // }

    // public get valid(): boolean {
    //   return !this.invalid
    // }

    // ngOnInit(): void {
    // }
    setMarker(marker: GeoPoint) {
            if (marker !== undefined) {
                this.form.setValue(marker);
            }
    }

    setFromMarker() {
        this.marker$.pipe(
            first(),
        ).subscribe(
            marker => this.setMarker(marker)
        )
    }

    setFromMapClick() {
        this.marker$.pipe(
            skip(1),
            first(),
        ).subscribe(
            marker => this.setMarker(marker)
        )
    }

    onEnter() {
        const value = this.form.value
        if (value !== undefined) {
            this.store.dispatch(new MapAction.ChangeMarker(value as GeoPoint))
        }
    }

    writeValue(value: GeoPoint) {
        if (value) {
            this.form.setValue(value, { emitEvent: false });
        }
    }

    registerOnChange(onChange: any) {
        const sub = this.form.valueChanges.subscribe(onChange);
        this.onChangeSubs.push(sub);
    }

    registerOnTouched(onTouched: any) {
        this.onTouched = onTouched;
    }

    markAsTouched() {
        if (!this.touched) {
            this.onTouched();
            this.touched = true;
        }
    }

    setDisabledState(disabled: boolean) {
        this.disabled = disabled;
    }

    validate(control: AbstractControl): ValidationErrors | null {
      const isIncorrect = this.form.invalid;

      return isIncorrect ? { invalidLocation: {wrongLon: this.getErrors('lon'), wrongLat: this.getErrors('lat')} } : null;
    }

    getErrors(name:string) {
      return this.form.get(name)!.errors
    }
    ngOnDestroy() {
        for (let sub of this.onChangeSubs) {
            sub.unsubscribe();
        }
    }
}

let lonLatFormat = /^-?\d{1,3}[,|.]?\d*$/gm;

export function wrongLatValidator(control: AbstractControl): ValidationErrors | null {
    // const val = control.value.toString();
    const val = control.value;

    // if (!val.match(lonLatFormat)) {
    //     return { wrongFormat: { value: val } };
    // }
    if (parseFloat(val) < -90. || parseFloat(val) > 90.) {
        return { valOutOfBound: { value: val } };
    }
    return null;
}

export function wrongLonValidator(control: AbstractControl): ValidationErrors | null {
    // const val = control.value.toString();
    const val = control.value;
    // if (!val.match(lonLatFormat)) {
    //     return { wrongFormat: { value: val } };
    // }
    if (parseFloat(val) < -180. || parseFloat(val) > 180.) {
        return { valOutOfBound: { value: val } };
    }
    return null;
}
