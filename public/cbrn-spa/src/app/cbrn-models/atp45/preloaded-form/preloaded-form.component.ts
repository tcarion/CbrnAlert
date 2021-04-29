import { MapService } from './../../../services/map.service';
import { FormService } from './../../../services/form.service';
import { FormItem } from './../../../interfaces/form-item';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { wrongLatValidator } from 'src/app/shared/validators';

@Component({
    selector: 'app-preloaded-form',
    templateUrl: './preloaded-form.component.html',
    styleUrls: ['./preloaded-form.component.scss']
})
export class PreloadedFormComponent implements OnInit, OnDestroy {
    @Input() formItems: any;

    preloadedForm: FormGroup = this.formbuilder.group({});
    mapSubscription: Subscription;
    constructor(private formbuilder: FormBuilder, private formService: FormService, private mapService: MapService) { 

    }

    ngOnInit(): void {
        this.initForm()

        this.mapSubscription = this.mapService.mapSubject.subscribe(
            (cbrnMap: any) => {
                let marker = cbrnMap.marker;
                this.preloadedForm.patchValue({
                    lon: `${marker.lon}`,
                    lat: `${marker.lat}`
                })
            }
        )

        this.preloadedForm.get('lat')?.valueChanges.subscribe( () => {
            this.emitIfValid();
        })

        this.preloadedForm.get('lon')?.valueChanges.subscribe( () => {
            this.emitIfValid();
        })

        this.formService.newCurrentForm(this.preloadedForm)
    }

    initForm() {
        let formControls: {[k: string]: any} = {};
        this.formItems.forEach((formItem: FormItem) => {
            let validators = formItem.validators === undefined ? [] : formItem.validators
            formControls[formItem.controlName] = [formItem.placeholder === undefined ? '' : formItem.placeholder, validators]
        });
        this.preloadedForm = this.formbuilder.group(formControls);
    }

    emitIfValid() {
        if (this.preloadedForm.get('lat')?.valid && this.preloadedForm.get('lon')?.valid) {
            this.formService.emitCurrentForm();
        }
    }

    ngOnDestroy() {
        this.mapSubscription.unsubscribe();
    }

}
