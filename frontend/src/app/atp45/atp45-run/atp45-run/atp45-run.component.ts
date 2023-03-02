import { Atp45State } from './../../../core/state/atp45.state';
import { Atp45Input } from './../../../core/api/models/atp-45-input';
import { Atp45Service } from 'src/app/atp45/atp45.service';
import { from, Observable, of } from 'rxjs';
import { Atp45RunTypes } from './../../../core/api/models/atp-45-run-types';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormRecord } from '@angular/forms';
import { Atp45Category, Atp45WeatherManual, ForecastAvailableSteps, ForecastStep, GeoPoint } from 'src/app/core/api/models';
import { Atp45ApiService } from 'src/app/core/api/services';
import { Select, Store } from '@ngxs/store';
import { MapPlotAction } from 'src/app/core/state/map-plot.state';
import { map, take } from 'rxjs/operators';
import { ForecastStartAction } from 'src/app/core/state/atp45.state';
import { TabsComponent } from 'src/app/shared/tabs/tabs.component';
import { NotificationService } from 'src/app/core/services/notification.service';

@Component({
  selector: 'app-atp45-run',
  templateUrl: './atp45-run.component.html',
  styleUrls: ['./atp45-run.component.scss'],
})
export class Atp45RunComponent implements OnInit {
  isCaseSelectionValid = false;
  canSubmit = false;
  stabilityRequired: boolean;
  numberOfLocations: number = 1;
  selectedCases: Atp45Category[];

  default_runType: Atp45RunTypes = Atp45RunTypes.Forecast;
  runTypes = Atp45RunTypes;
  @ViewChild(TabsComponent) tabs: TabsComponent;

  leadtimes$: Observable<string[]>;

  runForm = new FormGroup({});

  constructor(
    private api: Atp45ApiService,
    private atp45Service: Atp45Service,
    private store: Store,
    private notification: NotificationService
  ) {
    this.runForm.statusChanges.subscribe(() => {
      this.updateCanSubmit();
    });
    this.atp45Service.getAvailableSteps();
  }

  ngOnInit(): void {
    this.leadtimes$ = this.atp45Service.availableForecast$.pipe(map(res => {
      return res == null ? [] : res.leadtimes
    }))
  }

  onCaseValidityChange($event: boolean) {
    this.isCaseSelectionValid = $event;
    this.updateCanSubmit();
  }

  changeRequired($event: any) {
    this.stabilityRequired = $event.stabilityRequired;
    this.numberOfLocations = $event.numberOfLocations;
  }

  changeSelected($event: Atp45Category[]) {
    this.selectedCases = $event;
  }

  updateCanSubmit() {
    this.canSubmit = this.isCaseSelectionValid && this.runForm.valid;
  }

  get activeTabId() {
    return this.tabs.activeTab.id;
  }

  onSubmit() {
    console.log(this.tabs)
    const locations = this.runForm.get('locations')!.value as GeoPoint[];
    let weatherInput;
    const activeTab = this.activeTabId as Atp45RunTypes;
    if (activeTab == Atp45RunTypes.Manually) {
      weatherInput = this.runForm.get('weather')!.value as Atp45WeatherManual
    } else if (activeTab == Atp45RunTypes.Forecast) {
      const leadtime = this.runForm.get('leadtime')!.value as string
      let start = "";
      this.store.select(Atp45State.forecastStart).pipe(take(1)).subscribe(val => start = val)
      weatherInput = {
        start,
        leadtime
      } as ForecastStep
    } else if (activeTab == Atp45RunTypes.Archive) {
      const archiveDate = this.runForm.get('archiveDate')!.value
      weatherInput = {
        archiveDate
      }
    } else {
      throw new Error("Wrong tab ID");
    }
    const body = {
      categories: this.selectedCases.map((cat) => cat.id),
      locations,
      weatherInput
    } as Atp45Input
    const params = {
      weathertype: activeTab,
      body
    };
    console.log(params);
    this.api.atp45RunPost(params).subscribe((res) => {
      this.store.dispatch(new MapPlotAction.Add(res, 'atp45'));
      this.notification.snackBar("ATP45 run successful. The result has been added to the map.")
    });
  }
}
