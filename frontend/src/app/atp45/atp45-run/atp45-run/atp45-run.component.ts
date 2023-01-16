import { Atp45RunTypes } from './../../../core/api/models/atp-45-run-types';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormRecord } from '@angular/forms';
import { Atp45Category } from 'src/app/core/api/models';
import { Atp45ApiService } from 'src/app/core/api/services';
import { Store } from '@ngxs/store';
import { MapPlotAction } from 'src/app/core/state/map-plot.state';

@Component({
  selector: 'app-atp45-run',
  templateUrl: './atp45-run.component.html',
  styleUrls: ['./atp45-run.component.scss'],
})
export class Atp45RunComponent {
  isCaseSelectionValid = false;
  canSubmit = false;
  stabilityRequired: boolean;
  numberOfLocations: number = 1;
  selectedCases: Atp45Category[];

  default_runType: Atp45RunTypes = Atp45RunTypes.Forecast
  runTypes = Atp45RunTypes;

  runForm = new FormGroup({});

  constructor(
    private api: Atp45ApiService,
    private store: Store
  ) {
    this.runForm.statusChanges.subscribe(() => {
      this.updateCanSubmit();
    })
  }

  onCaseValidityChange($event: boolean) {
    this.isCaseSelectionValid = $event
    this.updateCanSubmit();
  }

  changeRequired($event: any) {
    this.stabilityRequired = $event.stabilityRequired;
    this.numberOfLocations = $event.numberOfLocations;
  }

  changeSelected($event: Atp45Category[]) {
    this.selectedCases = $event
  }

  updateCanSubmit() {
    this.canSubmit = this.isCaseSelectionValid && this.runForm.valid;
  }

  onSubmit() {
    const params = {
      weathertype : this.default_runType,
      body : {
        categories: this.selectedCases.map(cat => cat.id),
        locations: this.runForm.get('locations')!.value,
        weather: this.runForm.get('weather')!.value
      }
    };
    console.log(params)
    this.api.atp45RunPost(params).subscribe(res => {
      this.store.dispatch(new MapPlotAction.Add(res, 'atp45'))
    });
  }
}
