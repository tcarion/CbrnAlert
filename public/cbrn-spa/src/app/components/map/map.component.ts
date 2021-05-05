import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FormService } from '../../services/form.service';
import { MapService } from '../../services/map.service';
import { CbrnMap } from '../../models/cbrn-map';
import { AfterViewInit, Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit {

    formSubscription: Subscription;

    constructor(private mapService: MapService, private formService: FormService) { }

    ngAfterViewInit(): void {
        this.mapService.cbrnMap.mapInit('mapid', [50.82, 4.35], 8);
        this.mapService.onClickInit();

        this.formSubscription = this.formService.currentFormSubject.subscribe(
            (currentForm: FormGroup) => {
                let lonlat = {lon: currentForm.get('lon')?.value, lat: currentForm.get('lat')?.value};
                this.mapService.cbrnMap.marker = lonlat;
            }
        )
    }
}
