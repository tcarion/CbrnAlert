import { AbstractControl, NG_VALUE_ACCESSOR, ValidationErrors, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { Component, OnDestroy } from '@angular/core';
import { first, skip } from 'rxjs/operators';
import { MapState, MapAction } from 'src/app/core/state/map.state';
import { GeoPoint } from 'src/app/core/api/models';
import { ControlsOf, ControlValueAccessor, FormControl, FormGroup } from '@ngneat/reactive-forms';

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
            multi: true,
            useExisting: LocationComponent
        }
    ]
})
export class LocationComponent implements ControlValueAccessor, OnDestroy {

    value: GeoPoint = { lon: 0., lat: 0. };

    form = new FormGroup<ControlsOf<GeoPoint>>({
        lon: new FormControl<number>(0, [wrongLonValidator, Validators.required]),
        lat: new FormControl<number>(0, [wrongLatValidator, Validators.required])
    })

    markerSub: Subscription;
    statusSub: Subscription;

    touched = false;

    disabled = false;

    onChange = (value: GeoPoint) => { };

    onTouched = () => { };

    onChangeSubs: Subscription[] = [];

    @Select(MapState.userPoint) marker$: Observable<GeoPoint>;

    constructor(
        public store: Store,
    ) {
    }

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
            this.store.dispatch(new MapAction.ChangeMarker(value))
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

    ngOnDestroy() {
        for (let sub of this.onChangeSubs) {
            sub.unsubscribe();
        }
    }
}

let lonLatFormat = /^-?\d{1,3}[,|.]?\d*$/gm;

export function wrongLatValidator(control: AbstractControl): ValidationErrors | null {
    const val = control.value.toString();

    if (!val.match(lonLatFormat)) {
        return { wrongFormat: { value: val } };
    }
    if (parseFloat(val) < -90. || parseFloat(val) > 90.) {
        return { valOutOfBound: { value: val } };
    }
    return null;
}

export function wrongLonValidator(control: AbstractControl): ValidationErrors | null {
    const val = control.value.toString();

    if (!val.match(lonLatFormat)) {
        return { wrongFormat: { value: val } };
    }
    if (parseFloat(val) < -180. || parseFloat(val) > 180.) {
        return { valOutOfBound: { value: val } };
    }
    return null;
}
