import { GeoJsonSliceResponse } from './../api/models/geo-json-slice-response';
import { Injectable } from '@angular/core';
import { Atp45Service } from 'src/app/atp45/atp45.service';
import { MapPlot, PlotType } from '../models/map-plot';
import { tap } from 'rxjs/operators';
import { MapService } from './map.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Atp45ShapeData } from 'src/app/atp45/shape-data';
import { FlexpartPlotData } from 'src/app/flexpart/flexpart-plot-data';
import { Feature, FeatureCollection } from 'geojson';
import { ColorbarData } from '../api/models';

const plots: MapPlot[] = [
    // {
    //     type: 'atp45',
    //     id: 1,
    //     layer: {},
    //     info: {
    //         date: new Date(),
    //         windSpeed: 3.6
    //     }
    // },
    // {
    //     type: 'atp45',
    //     id: 2,
    //     layer: {},
    //     info: {
    //         date: new Date(),
    //         windSpeed: 8
    //     }
    // },
    // {
    //     type: 'flexpart',
    //     id: 1,
    //     layer: {},
    //     info: {
    //         date: new Date(),
    //         height: 20
    //     }
    // }
]

type MapPlotCount = {
    [K in PlotType]: number;
}

@Injectable({
    providedIn: 'root'
})
export class MapPlotsService {
    // mapPlots: MapPlot[] = plots;

    // mapPlotsSubject = new BehaviorSubject<MapPlot[]>([]);
    // mapPlots$ = this.mapPlotsSubject.asObservable();

    plotsCount: MapPlotCount = {
        'atp45': 0,
        'flexpart': 0,
    }
    count = 0;

    constructor(
        private mapService: MapService,
    ) { }

    createPlot(type: PlotType, info?: Object): MapPlot {
        this.plotsCount[type]++;
        this.count++;
        const newPlot = {
            type,
            name: "Plot " + this.plotsCount[type],
            id: this.count,
            info: info,
            visible: true,
            isActive: true,
        }
        // this.mapPlots.push(newPlot);
        return newPlot;
    }

    createAtp45Plot(atp45ShapeData:Atp45ShapeData) {
        let newPlot = this.createPlot('atp45', {startDate: atp45ShapeData.date});
        newPlot.geojson = atp45ShapeData.shapes;
        // let layer = this.mapService.geoJson2Layer(atp45ShapeData.shapes);
        // newPlot.layer = layer;
        this.mapService.addPlotToMap(newPlot);
        return newPlot;
        // this.emitPlots();
    }

    createFlexpartPlot(flexpartPlotData: GeoJsonSliceResponse) {
        // let newPlot = this.createPlot('flexpart', flexpartPlotData.flexpartResult);
        let newPlot = this.createPlot('flexpart');
        // newPlot.isActive = true;
        newPlot.metadata = flexpartPlotData.metadata as ColorbarData;
        newPlot.geojson = flexpartPlotData.collection as FeatureCollection;
        this.mapService.addPlotToMap(newPlot);
        return newPlot;
        // this.emitPlots();
    }

    addPlot({type, plotData}: any) {
        let mapPlot;
        switch (type) {
            case 'atp45':
                mapPlot = this.createAtp45Plot(plotData);
                break;
            case 'flexpart':
                mapPlot = this.createFlexpartPlot(plotData);
                break;
        }
        return mapPlot as MapPlot;
    }

    hideMapPlot(plot: MapPlot): void {
        this.mapService.hidePlotFromMap(plot);
    }

    showMapPlot(plot: MapPlot): void {
        this.mapService.showPlotToMap(plot);
    }

    setActive(plot: MapPlot): void {
        this.mapService.setActive(plot);
    }

    deleteMapPlot(plot: MapPlot): void {
        this.mapService.deletePlot(plot);
        // this.mapPlots = this.mapPlots.filter(p => p !== plot);
    }
}
