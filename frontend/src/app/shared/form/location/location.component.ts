import { AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormService } from 'src/app/core/services/form.service';
import { filter, map, tap } from 'rxjs/operators';
import { MapState, MapAction } from 'src/app/core/state/map.state';
import { GeoPoint } from 'src/app/core/api/models';
import { ControlsOf, FormArray, FormControl, FormGroup } from '@ngneat/reactive-forms';

// interface Locations {
//     locations: FormArray<GeoPoint>
// }
@Component({
    selector: 'app-location',
    templateUrl: './location.component.html',
    styleUrls: ['./location.component.scss']
})
export class LocationComponent implements OnInit, OnDestroy {
    formArray: FormArray<GeoPoint>;
    // locationsForm: FormGroup<Locations>

    @Input() formGroup: FormGroup<any>;
    // @Select((state:any) => state.mapState.marker) marker$: Observable<GeoPoint>;
    markerSub: Subscription;
    statusSub: Subscription;

    @Select(MapState.marker) marker$: Observable<GeoPoint>;
    constructor(
        public formService: FormService,
        // public formBuilder: FormBuilder,
        public store: Store,
    ) {
        // this.locationsForm = this.createLocations();
        this.formArray = this.createGeoPointArray()
    }

    ngOnInit(): void {
        this.formGroup.addControl('locations', this.formArray);
        this.markerSub = this.marker$.pipe(
            tap((marker) => {
                if (marker !== undefined) {
                    this.values = marker
                }
            }
            )
        ).subscribe()

        this.statusSub = this.getArrayElem(0).statusChanges.pipe(
            filter(status => status === 'VALID'), 
            tap(() => {
                // this.mapService.cbrnMap.marker = this.getLonlat(formGroup);
                this.store.dispatch(new MapAction.ChangeMarker(this.getGeoPoint()))
            })
        ).subscribe();
    }

    ngAfterViewInit() {

        // this.formService.lonlatValid2(this.locations.controls[0] as FormGroup).subscribe()

    }

    set values(coords:GeoPoint) {
        this.getArrayElem(0).setValue(coords, {emitEvent: false})
        // this.getArrayElem(0).get('lon')!.setValue(coords.lon.toString(), {emitEvent: false})
        // this.getArrayElem(0).get('lat')!.setValue(coords.lat.toString(), {emitEvent: false})
    }

    get locations() {
        return this.formArray;
    }

    getArrayElem(i: number) {
        return this.formArray.controls[i]
    }

    getGeoPoint() {
        return this.getArrayElem(0).value;
    }

    // createLocations() {
    //     // return new FormGroup<ControlsOf<{locations: GeoPoint[]}>>({locations: this.createGeoPointArray()})
    //     return new FormGroup<Locations>({locations: this.createGeoPointArray()});
    // }

    createGeoPointArray() {
        return new FormArray<GeoPoint>([this.createGeoPoint()])
    }

    createGeoPoint() {
        return new FormGroup<ControlsOf<GeoPoint>>({
            lon: new FormControl<number>(0, wrongLonValidator),
            lat: new FormControl<number>(0, wrongLatValidator)
        })
    }

    ngOnDestroy(): void {
        this.markerSub.unsubscribe();
        this.statusSub.unsubscribe();
    }
}

let lonLatFormat = /^-?\d{1,3}[,|.]?\d*$/gm;

export function wrongLatValidator(control: AbstractControl) : ValidationErrors | null {
    const val = control.value.toString();
    
    if (!val.match(lonLatFormat)) {
      return { wrongFormat: { value: val } };
    }
    if (parseFloat(val) < -90. || parseFloat(val)  > 90.) {
      return { valOutOfBound: { value: val } };
    }
    return null;
}

export function wrongLonValidator(control: AbstractControl) : ValidationErrors | null {
      const val = control.value.toString();
      
      if (!val.match(lonLatFormat)) {
        return { wrongFormat: { value: val } };
      }
      if (parseFloat(val) < -180. || parseFloat(val)  > 180.) {
        return { valOutOfBound: { value: val } };
      }
      return null;
}
