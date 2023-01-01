import { wrongLonValidator } from 'src/app/shared/validators';
import { WebsocketService } from 'src/app/core/services/websocket.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { FormService } from '../../core/services/form.service';
import { Subscription } from 'rxjs';
import { MapService } from 'src/app/core/services/map.service';
import { UntypedFormGroup } from '@angular/forms';
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { AbstractWsComponent } from 'src/app/abstract-classes/abstract-ws-component';
import { FormItemBase } from 'src/app/shared/form/form-item-base';
import { SelectFormItem } from 'src/app/shared/form/form-item-select';
import { DatepickerFormItem } from 'src/app/shared/form/form-item-datepicker';
import { TextFormItem } from 'src/app/shared/form/form-item-text';
import { FormItems } from 'src/app/shared/form/form-items';
import { Atp45Service } from '../atp45.service';

const formItems: FormItemBase[] = [

    new DatepickerFormItem({
        key: 'forecastDate',
        label: 'Date of the forecast',
        required: true,
        minmax: {max: new Date()}
    }),
    new SelectFormItem({
        key: 'forecastTime',
        label: 'Forecast starting time',
        required: true,
        autoSelect: true,
        options: [
            {key: "00:00:00"},
            {key: "12:00:00"},
        ]
    }),
    new TextFormItem({
        key: 'area',
        label: 'Area to retrieve',
        type: 'mapObject',
        required: true,
        disabled: true,
        mapper: (a: number[]) => a.map(e => Math.round(e * 100)/100).join(', ')
    }),
]
@Component({
    selector: 'app-archive',
    templateUrl: './archive.component.html',
    styleUrls: ['./archive.component.scss']
})
export class ArchiveComponent extends AbstractWsComponent implements OnInit, OnDestroy, AfterViewInit {
    formItems = new FormItems(formItems);

    formGroup: UntypedFormGroup;

    mapSubscription: Subscription;

    constructor(
        public formService: FormService,
        private mapService: MapService,
        private atp45Service: Atp45Service,
        public notificationService: NotificationService,
        public websocketService: WebsocketService) {
            super(websocketService, notificationService);
         }


    ngAfterViewInit() {
        this.mapSubscription = this.mapService.mapEventSubject.subscribe({
            next: (event) => {
                if (event == 'areaSelection') {
                    let area = this.mapService.cbrnMap.layerToArea(this.mapService.cbrnMap.areaSelection);
                    this.formGroup.get('area')?.patchValue(area);
                }
            }
        });

    }

    ngOnInit(): void {
        super.ngOnInit();
        this.formGroup = this.formService.toFormGroup(this.formItems.items);

        this.mapService.addDrawControl();
        this.mapService.onAreaSelectionInit();
    }

    onSubmit() {
        const datetime = this.formService.toDate(this.formGroup.get('forecastDate')?.value, this.formGroup.get('forecastTime')?.value);

        const archiveInput = {
            datetime: this.formService.removeTimeZone(datetime),
            area: this.formGroup.get("area")?.value,
        }

        this.atp45Service.archiveRequest(archiveInput)

    }

    ngOnDestroy() {
        super.ngOnDestroy();
        this.mapService.cbrnMap.removeDrawControl();
        this.mapService.cbrnMap.removeLayer(this.mapService.cbrnMap.areaSelection);
        this.mapSubscription.unsubscribe();
    }

}
