import { MapPlot } from 'src/app/core/models/map-plot';
import { FeatureCollection } from 'geojson';
import { Atp45ShapeData } from './../../atp45/shape-data';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Atp45Service } from 'src/app/atp45/atp45.service';
import { MapPlotsService } from 'src/app/core/services/map-plots.service';
// import { ShapeData } from 'src/app/atp45/shape-data';
import { CbrnMap } from '../models/cbrn-map';

type MapEvent = 'newMarker' | 'areaSelection'
@Injectable({
    providedIn: 'root'
})
export class MapService {
    cbrnMap = new CbrnMap();

    mapSubject = new Subject<CbrnMap>();
    mapEventSubject = new Subject<MapEvent>();



    constructor(
    ) { }

    emitMapSubject() {
        this.mapSubject.next(this.cbrnMap);
    }

    emitEventSubject(event: MapEvent) {
        this.mapEventSubject.next(event);
    }

    onClickInit() {
        this.cbrnMap.map.on('click', (e: L.LeafletMouseEvent) => {
            let latlng = e.latlng;
            let lat = Math.round(latlng.lat * 1000) / 1000;
            let lon = Math.round(latlng.lng * 1000) / 1000;
            this.cbrnMap.marker = {lon, lat};
            this.emitMapSubject();
            this.emitEventSubject('newMarker');
        })
    }

    offClickEvent() {
        this.cbrnMap.map.off('click');
    }

    onAreaSelectionInit() {
        this.cbrnMap.map.on('draw:created', (e) => {
            this.cbrnMap.newAreaSelection(e.layer);
            this.emitMapSubject();
            this.emitEventSubject('areaSelection');
        });
    }

    offAreaSelectionEvent() {
        this.cbrnMap.map.off('draw:created');
    }

    // atp45ResultToLayer(): Observable<{shapeData:ShapeData, layer: L.Layer}> {
    //     return this.atp45Service.resultsSubject
    //         .pipe(
    //             map((shapeData) => {
    //                 let rawLayer = this.cbrnMap.getLayerFromShapes(shapeData.shapes);
    //                 // let mapLayer = this.addLayerToMap(rawLayer);
    //                 return {
    //                     layer: rawLayer,
    //                     shapeData
    //                 }
    //             })
    //         )
    // }

    addPlotToMap(plot: MapPlot) {
        if (plot.type === 'atp45') {
            this.cbrnMap.addAtp45Plot(plot)
        }
        else if (plot.type === 'flexpart') {
            this.cbrnMap.addFlexpartPlot(plot);
        }
    }

    hidePlotFromMap(plot: MapPlot) {
        if (plot.type === 'atp45') {
            this.cbrnMap.hideAtp45Plot(plot);
        }
        else if (plot.type === 'flexpart') {
            this.cbrnMap.hideFlexpartPlot(plot);
        }
    }

    showPlotToMap(plot: MapPlot) {
        if (plot.type === 'atp45') {
            this.cbrnMap.showAtp45Plot(plot);
        }
        else if (plot.type === 'flexpart') {
            this.cbrnMap.showFlexpartPlot(plot);
        }
    }

    deletePlot(plot: MapPlot) {
        if (plot.type === 'atp45') {
            this.cbrnMap.deleteAtp45Plot(plot);
        }
        else if (plot.type === 'flexpart') {
            this.cbrnMap.deleteFlexpartPlot(plot);
        }
    }

}
