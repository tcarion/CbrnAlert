import { CbrnMap } from './../models/cbrn-map';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

type mapEvent = 'newMarker' | 'areaSelection'
@Injectable({
    providedIn: 'root'
})

export class MapService {
    cbrnMap = new CbrnMap();

    mapSubject = new Subject<CbrnMap>();
    mapEventSubject = new Subject<mapEvent>();

    constructor() { 

    }

    emitMapSubject() {
        this.mapSubject.next(this.cbrnMap);
    }

    emitEventSubject(event: mapEvent) {
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

}
