import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FormService } from '../../services/form.service';
import { MapService } from '../../services/map.service';
import { CbrnMap } from '../../models/cbrn-map';
import { AfterViewInit, Component, OnInit, OnDestroy } from '@angular/core';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit, OnDestroy {

    formSubscription: Subscription;

    constructor(private mapService: MapService, private formService: FormService) { }

    ngAfterViewInit(): void {
        this.mapService.cbrnMap.mapInit('mapid', [50.82, 4.35], 8);
        // this.mapService.onClickInit();

        this.formSubscription = this.formService.currentFormSubject.subscribe(
            (currentForm) => {
                const lon = currentForm.formGroup.get('lon')?.value;
                const lat = currentForm.formGroup.get('lat')?.value;
                if ((lon !== undefined && lat !== undefined)
                    && lon !== "" && lat !== "") {
                    let lonlat = {lon, lat};
                    this.mapService.cbrnMap.marker = lonlat;
                }
            }
        )
    }

    ngOnDestroy() {
        this.formService.currentFormSubject.unsubscribe();
    }
}
