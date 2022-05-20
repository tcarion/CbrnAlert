import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { FormService } from 'src/app/core/services/form.service';
import { filter, map, tap } from 'rxjs/operators';
import { MapState, MapAction } from 'src/app/core/state/map.state';
import { LonlatControl } from '../lonlat-control';
import { GeoPoint } from 'src/app/core/api/models';

@Component({
    selector: 'app-location',
    templateUrl: './location.component.html',
    styleUrls: ['./location.component.scss']
})
export class LocationComponent implements OnInit {
    lonlatFormArray: FormArray;
    
    @Input() formGroup: FormGroup;
    // @Select((state:any) => state.mapState.marker) marker$: Observable<GeoPoint>;
    @Select(MapState.marker) marker$: Observable<GeoPoint>;
    constructor(
        public formService: FormService,
        public formBuilder: FormBuilder,
        public store: Store,
    ) { 
        // this.lat$ = this.mapState$.pipe(map(c => c.marker!.lat))
    }

    ngOnInit(): void {
        this.formGroup.addControl('locations', this.lonlatControlArray());
        this.marker$.pipe(
            tap((marker) => {
                if (marker !== undefined) {
                    this.values = marker
                }
            }
            )
        ).subscribe()

    }

    ngAfterViewInit() {

        // this.formService.lonlatValid2(this.locations.controls[0] as FormGroup).subscribe()
        this.getArrayElem(0).statusChanges.pipe(
            filter(status => status === 'VALID'), 
            tap(() => {
                // this.mapService.cbrnMap.marker = this.getLonlat(formGroup);
                this.store.dispatch(new MapAction.ChangeMarker(this.getLonlat()))
            })
        ).subscribe();
    }

    set values(coords:GeoPoint) {
        this.getArrayElem(0).get('lon')!.setValue(coords.lon.toString(), {emitEvent: false})
        this.getArrayElem(0).get('lat')!.setValue(coords.lat.toString(), {emitEvent: false})
    }

    get locations() {
        return this.formGroup.get('locations') as FormArray;
    }

    getArrayElem(i: number) {
        return this.locations.controls[i] as FormGroup
    }

    getLonlat() {
        const lon = this.getArrayElem(0).get('lon')?.value;
        const lat = this.getArrayElem(0).get('lat')?.value;
        return {lon, lat};
    }

    lonlatControlArray() {
        return this.formBuilder.array([
            this.formBuilder.group(new LonlatControl())
        ])
    }
}
