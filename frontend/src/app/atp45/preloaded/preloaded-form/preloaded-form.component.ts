
import { GribData } from '../../grib-data';
import { MapService } from 'src/app/core/services/map.service';
import { FormService } from 'src/app/core/services/form.service';
import { Component, Input, OnDestroy, OnInit, ViewChild, AfterViewInit, SimpleChanges } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { wrongLatValidator, wrongLonValidator } from 'src/app/shared/validators';
import { Atp45Service } from 'src/app/atp45/atp45.service';
import { FormItemBase } from 'src/app/shared/form/form-item-base';
import { TextFormItem } from 'src/app/shared/form/form-item-text';
import { SelectFormItem } from 'src/app/shared/form/form-item-select';
import { OnChanges } from '@angular/core';
import { FormItems } from 'src/app/shared/form/form-items';
import { Store } from '@ngxs/store';
import { MapPlotAction } from 'src/app/core/state/map-plot.state';


const formItems: FormItemBase[] = [
    new TextFormItem({
        key: 'lat',
        label: 'Release latitude [°]',
        type: 'input',
        hint: '[-90.0°, 90.0°]',
        required: true,
        validators: [wrongLatValidator]
    }),
    new TextFormItem({
        key: 'lon',
        label: 'Release longitude [°]',
        type: 'input',
        hint: '[-180°, 180°]',
        required: true,
        validators: [wrongLonValidator]
    }),
    new SelectFormItem({
        key: 'step',
        label: 'Forecast step selection: ',
        required: true,
        options: [],
    }),
]
@Component({
    selector: 'app-preloaded-form',
    templateUrl: './preloaded-form.component.html',
    styleUrls: ['./preloaded-form.component.scss']
})
export class PreloadedFormComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {
    formItems = new FormItems(formItems);
    formGroup: FormGroup;

    @Input() gribData: GribData;

    mapSubscription: Subscription;

    constructor(
        public formService: FormService,
        private mapService: MapService,
        private atp45Service: Atp45Service,
        private store: Store,
        ) {
        }

    ngAfterViewInit() {

        this.formService.lonlatValid(this.formGroup).subscribe(() => {
            this.mapService.cbrnMap.marker = this.formService.getLonlat(this.formGroup);
        })
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.gribData && changes.gribData.currentValue) {
            const newGribData = changes.gribData.currentValue;

            this.updateStepSelection(newGribData);
            this.mapService.cbrnMap.newAvailableArea(newGribData.area);
        }
    }

    ngOnInit(): void {
        this.formGroup = this.formService.toFormGroup(this.formItems.items);

        this.mapService.onClickInit();

        this.mapSubscription = this.mapService.mapEventSubject.subscribe(
            (event) => {
                if (event == 'newMarker') {
                    let marker = this.mapService.cbrnMap.marker;
                    this.formService.patchMarker(this.formGroup, marker);
                }
            }
        );
    }

    updateStepSelection(gribData: GribData) {
        this.atp45Service.availablesSteps(gribData).subscribe(
            (data: any) => {
                this.formItems.get('step').options = this.formService.objectToOptions(data.steps);
            },
            (error: HttpErrorResponse) => {
                console.error(error.error);
            }
        );
    }

    onSubmit() {
        const date = this.gribData.startDate;

        const atp45Input = {
            datetime:  this.formService.removeTimeZone(date),
            lat: this.formGroup.get('lat')?.value,
            lon: this.formGroup.get('lon')?.value,
            step: this.formGroup.get('step')?.value,
            loaded_file: this.gribData.filename,
            area: this.gribData.area
        };

        this.atp45Service.preloadedResultRequest(atp45Input).subscribe(res => {
            // this.store.dispatch(new MapPlotAction.Add(res, 'atp45'))
        });
    }

    ngOnDestroy() {
        this.mapSubscription.unsubscribe();
        this.mapService.offClickEvent();
        this.mapService.cbrnMap.removeAvailableArea();
    }

}
