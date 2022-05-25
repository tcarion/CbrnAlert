import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@ngneat/reactive-forms';
import { GeoPoint } from 'src/app/core/api/models';

@Component({
  selector: 'app-location-array',
  templateUrl: './location-array.component.html',
  styleUrls: ['./location-array.component.scss']
})
export class LocationArrayComponent implements OnInit {

    locationsControls: FormArray<GeoPoint, FormControl<GeoPoint>> = new FormArray([this.newControl()])

    // @Input() formGroup: FormGroup<{locations:  FormArray<GeoPoint, FormControl<GeoPoint>>}>;
    @Input() formGroup: FormGroup<any>;

    constructor(
    ) {
    }
    
    ngOnInit(): void {
        this.formGroup.addControl('locations', this.locationsControls)
    }

    
    get locations() {
        return this.formGroup.get('locations') as FormArray<GeoPoint, FormControl<GeoPoint>>;
    }

    newControl() {
        return new FormControl<GeoPoint>({lon: 0, lat: 0})
    }

    add() {
        this.locations.push(this.newControl());
    }

    remove() {
        this.locations.removeAt(this.locations.length-1)
    }
}
