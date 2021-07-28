import { Injectable } from '@angular/core';
import { Atp45Service } from 'src/app/atp45/atp45.service';
import { MapPlot, PlotType } from '../models/map-plot';
import { tap } from 'rxjs/operators';
import { MapService } from './map.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Atp45ShapeData } from 'src/app/atp45/shape-data';
import { FlexpartPlotData } from 'src/app/flexpart/flexpart-plot-data';

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
    mapPlots: MapPlot[] = plots;

    mapPlotsSubject = new BehaviorSubject<MapPlot[]>([]);
    mapPlots$ = this.mapPlotsSubject.asObservable();

    plotsCount: MapPlotCount = {
        'atp45': 0,
        'flexpart': 0,
    }

    constructor(
        private mapService: MapService,
    ) { }

    addPlot(type: PlotType, info?: Object): MapPlot {
        this.plotsCount[type]++;
        const newPlot = {
            type,
            id: this.plotsCount[type],
            info: info,
            visible: true,
        }
        this.mapPlots.push(newPlot);
        return newPlot;
    }

    addAtp45Plot(atp45ShapeData:Atp45ShapeData) {
        let newPlot = this.addPlot('atp45', {startDate: atp45ShapeData.date});
        newPlot.geojson = atp45ShapeData.shapes;
        // let layer = this.mapService.geoJson2Layer(atp45ShapeData.shapes);
        // newPlot.layer = layer;
        this.mapService.addPlotToMap(newPlot);
        this.emitPlots();
    }

    addFlexpartPlot(flexpartPlotData: FlexpartPlotData) {
        let newPlot = this.addPlot('flexpart', flexpartPlotData.flexpartResult);
        // newPlot.isActive = true;
        newPlot.metadata = flexpartPlotData.legendData;
        newPlot.geojson = flexpartPlotData.cells;
        this.mapService.addPlotToMap(newPlot);
        this.emitPlots();
    }

    hideMapPlot(plot: MapPlot): void {
        plot.visible = false;
        this.mapService.hidePlotFromMap(plot);
    }

    showMapPlot(plot: MapPlot): void {
        plot.visible = true;
        this.mapService.showPlotToMap(plot);
    }

    deleteMapPlot(plot: MapPlot): void {
        this.mapService.deletePlot(plot);
        this.mapPlots = this.mapPlots.filter(p => p !== plot);
        this.emitPlots();
    }

    emitPlots() {
        this.mapPlotsSubject.next(this.mapPlots);
    }

}
