import { MapPlot } from 'src/app/core/models/map-plot';
import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
// import { ShapeData } from 'src/app/atp45/shape-data';
import { CbrnMap } from '../models/cbrn-map';

type MapEvent = 'newMarker' | 'areaSelection'
@Injectable({
    providedIn: 'root'
})
export class MapService {
    private map = new CbrnMap();

    mapSubject: BehaviorSubject<CbrnMap>;
    map$: Observable<CbrnMap>;
    mapEventSubject = new Subject<MapEvent>();
    mapPlotEvent = new Subject<number>();
    mapPlotEvent$: Observable<number>;

    constructor(
    ) { 
        this.mapSubject = new BehaviorSubject(this.map);
        this.map$ = this.mapSubject.asObservable();
        this.mapPlotEvent$ = this.mapPlotEvent.asObservable();

    }

    // emitMapSubject() {
    //     this.mapSubject.next(this.cbrnMap);
    // }

    get cbrnMap() { 
        return this.mapSubject.value
    }

    emitEventSubject(event: MapEvent) {
        this.mapEventSubject.next(event);
    }

    initMap(id: string) {
        this.cbrnMap.mapInit(id, [50.82, 4.35], 8);
        this.mapSubject.next(this.cbrnMap);
    }

    isMapInitialized(timeout: number) {
        var start = Date.now();
        let waitForMapInit = (resolve: Function, reject: Function) => {
            if (this.cbrnMap.map)
                resolve(this.cbrnMap.map);
            else if (timeout && (Date.now() - start) >= timeout)
                reject(new Error("timeout"));
            else
                setTimeout(waitForMapInit.bind(this, resolve, reject), 30);
        }
        return new Promise(waitForMapInit);
    }

    onClickInit() {
        this.isMapInitialized(3000).then(() => {
            this.emitWhenClicked();
        });
    }

    emitWhenClicked() {
        this.cbrnMap.map.on('click', (e: L.LeafletMouseEvent) => {
            let latlng = e.latlng;
            let lat = latlng.lat;
            let lon = latlng.lng;
            this.cbrnMap.marker = {lon, lat};
            // this.emitMapSubject();
            this.emitEventSubject('newMarker');
        })
    }

    offClickEvent() {
        this.cbrnMap.map.off('click');
    }

    onAreaSelectionInit() {
        this.isMapInitialized(3000).then(() => {
            this.cbrnMap.map.on('draw:created', (e) => {
                this.cbrnMap.newAreaSelection(e.layer);
                // this.emitMapSubject();
                this.emitEventSubject('areaSelection');
            });
        });
    }

    offAreaSelectionEvent() {
        this.cbrnMap.map.off('draw:created');
    }

    addDrawControl() {
        this.isMapInitialized(3000).then(() => {
            this.cbrnMap.addDrawControl();
        });
    }

    addPlotToMap(plot: MapPlot) {
        if (plot.type === 'atp45') {
            this.cbrnMap.addAtp45Plot(plot)
        }
        else if (plot.type === 'flexpart') {
            const newPlot = this.cbrnMap.addFlexpartPlot(plot);
            newPlot.layers.on('click', e => {
                this.mapPlotEvent.next(newPlot.id);
            })
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

    setActive(plot: MapPlot) {
        this.cbrnMap.setActive(plot);
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
