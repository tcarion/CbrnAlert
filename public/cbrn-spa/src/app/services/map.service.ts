import { CbrnMap } from './../models/cbrn-map';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { LeafletMouseEvent } from 'leaflet';

@Injectable({
    providedIn: 'root'
})
export class MapService {
    cbrnMap = new CbrnMap();

    mapSubject = new Subject<CbrnMap>();

    constructor() { 

    }

    emitMapSubject() {
        this.mapSubject.next(this.cbrnMap)
    }

    onClickInit() {
        (<L.Map>this.cbrnMap.map).on('click', (e: L.LeafletMouseEvent) => {
            let latlng = e.latlng;
            let lat = Math.round(latlng.lat * 1000) / 1000;
            let lon = Math.round(latlng.lng * 1000) / 1000;
            this.cbrnMap.marker = {lon, lat};
            this.emitMapSubject()
        })
    }

}
