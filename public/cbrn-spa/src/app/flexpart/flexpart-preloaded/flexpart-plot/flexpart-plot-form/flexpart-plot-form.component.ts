import { Subject, Subscription } from 'rxjs';
import { Validators } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';
import { FlexpartResult } from 'src/app/flexpart/flexpart-result';
import { FormItem } from 'src/app/core/models/form-item';
import { DatePipe } from '@angular/common';
import { ApiService } from 'src/app/core/services/api.service';
import { MapService } from 'src/app/core/services/map.service';
import { FormService } from 'src/app/core/services/form.service';

const formItems: FormItem[] = [
    {
        controlName: 'timeSteps',
        label: 'Date to plot',
        type: 'select',
        validators: [Validators.required],
        value: {
            obj: [],
            display: [],
            withPipe: { pipe: DatePipe, arg: ["YYYY-MM-dd @ HH:mm"] }
        }
    },
    {
        controlName: 'heights',
        label: 'Height',
        type: 'select',
        validators: [Validators.required]
    },
]
@Component({
    selector: 'app-flexpart-plot-form',
    templateUrl: './flexpart-plot-form.component.html',
    styleUrls: ['./flexpart-plot-form.component.scss']
})
export class FlexpartPlotFormComponent implements OnInit {
    formItems = formItems;

    @Input() newSelectionSubject: Subject<FlexpartResult>;
    flexpartResult: FlexpartResult;

    mapSubscription: Subscription;
    newSelectionSubscription: Subscription;

    constructor(
        private mapService: MapService,
        private apiService: ApiService,
        public formService: FormService,
    ) {
    }

    ngOnInit(): void {
        
    }

    ngAfterViewInit() {
        this.newSelectionSubscription = this.newSelectionSubject.subscribe((fpResult) => {
            this.initForm(fpResult);
            this.flexpartResult = fpResult;
        });
    }

    initForm(fpResult: FlexpartResult) {
        const startDate = fpResult.startDate;
        const endDate = fpResult.endDate;
        const timeSteps = fpResult.times;
        const heights =fpResult.heights;
        let available_dates: Date[] = [];
        timeSteps.forEach(i => {
            available_dates.push(new Date(startDate.getTime() + i * 36e5));
        });

        ['timeSteps'].map((e) => {
            this.formService.currentForm.form.newDistVal(e, timeSteps, available_dates);
            this.formService.currentForm.formGroup.get(e)?.patchValue(timeSteps[0]);
        });
        this.formService.currentForm.form.newVal('heights', heights);
        this.formService.currentForm.formGroup.get('heights')?.patchValue(heights[0]);
        this.mapService.cbrnMap.newAvailableArea(fpResult.area);
    }

    onSubmit() {
        let formFields = this.formService.formToObject();
        formFields = {
            ...formFields,
            dataDirname: this.flexpartResult.dataDirname,
        }
        const payload = {
            ...formFields,
            flexpartResult: this.flexpartResult,
            // request: "flexpart_conc",
            request: "flexpart_geojson_conc"
        };
        console.log(payload);

        this.apiService.flexpartRequest(payload).subscribe({
            next: (data: any) => {
                console.log(data);
                this.mapService.cbrnMap.addGeoJsonLayer(data);
                // this.mapService.cbrnMap.addHeatLayer(data.lats, data.lons, data.values)
            },
            error: (error) => {
                alert(error.info);
            }
        })
    }

}
