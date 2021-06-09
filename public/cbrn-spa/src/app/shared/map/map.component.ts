import { Subscription } from 'rxjs';
import { FormService } from '../../core/services/form.service';
import { AfterViewInit, Component, OnInit, OnDestroy } from '@angular/core';
import { MapService } from 'src/app/core/services/map.service';
import { Atp45Service } from 'src/app/atp45/atp45.service';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit, OnDestroy {

    formSubscription: Subscription;
    atp45ResultsSubscription: Subscription;

    constructor(
        private mapService: MapService, 
        private formService: FormService,
        private apt45Service: Atp45Service) { }

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
        );
        
        this.atp45ResultsSubscription = this.apt45Service.resultsSubject.subscribe((shapeData) => {
            this.mapService.cbrnMap.addAtp45Result(shapeData.shapes);
        });
    }

    ngOnDestroy() {
        this.formService.currentFormSubject.unsubscribe();
        this.atp45ResultsSubscription.unsubscribe();
    }
}
