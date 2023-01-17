import { Atp45ApiService } from 'src/app/core/api/services';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Atp45ShapeData } from './shape-data';

import { formatDate } from '@angular/common';
import { FeatureCollection } from 'geojson';
import { ForecastAvailableSteps } from '../core/api/models';
import { ForecastStartAction } from 'src/app/core/state/atp45.state';
import { Store } from '@ngxs/store';

@Injectable({
    providedIn: 'root',
})
export class Atp45Service {
    availableForecastSubject = new BehaviorSubject<ForecastAvailableSteps | null>(null);
    availableForecast$ = this.availableForecastSubject.asObservable();

    constructor(
        private apiService: Atp45ApiService,
        private store: Store,
    ) { }


    /**
     * @param  {any} shapeData
     * @returns Atp45ShapeData
     */
    responseToShapeData(shapeData: any): Atp45ShapeData {
        let shapes = <FeatureCollection>shapeData.shapes;
        shapeData.datetime = new Date(shapeData.datetime);
        let speed = Math.round(shapeData.wind.speed * 3.6 * 10) / 10;

        for (const feature of shapes.features) {
            if (!feature.properties) { break; }
            feature.properties.text = `
                <b>${feature.properties.label}</b><br>
                <b>Coordinates : (${shapeData.lat}, ${shapeData.lon})</b><br>
                wind speed = ${speed} km/h<br>
                date = ${formatDate(shapeData.datetime, 'yyyy-MM-dd', 'en-US')}<br>
                time = ${formatDate(shapeData.datetime, 'HH:mm', 'en-US')}<br>
                step = ${shapeData.step}`;
        }

        return shapeData;
    }

    getAvailableSteps() {
      // only get the available once
      this.apiService.forecastAvailableGet().subscribe(res => {
        this.store.dispatch(new ForecastStartAction.Update(res));
        this.availableForecastSubject.next(res)
      })
    }
}
