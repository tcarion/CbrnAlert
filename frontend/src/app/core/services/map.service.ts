import { GeoPoint } from 'src/app/core/api/models';
import { MapPlot } from 'src/app/core/models/map-plot';
import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
// import { ShapeData } from 'src/app/atp45/shape-data';
import { Map, Marker, latLng, Rectangle, LatLng, latLngBounds, rectangle, LayerOptions } from 'leaflet';
import { MapArea } from 'src/app/core/models/map-area';

type MapEvent = 'newMarker' | 'areaSelection'
@Injectable({
    providedIn: 'root'
})
export class MapService {

    drawnRectangle?: Rectangle
    drawnMarker?: Marker
    showRectangle: Rectangle

    mapEventSubject = new Subject<MapEvent>();
    mapPlotEvent = new Subject<number>();
    mapPlotEvent$: Observable<number>;

    leafletMap: Map;

    constructor(
    ) {
        this.mapPlotEvent$ = this.mapPlotEvent.asObservable();

    }

    // emitMapSubject() {
    //     this.mapSubject.next(this.cbrnMap);
    // }

    copyMarkerPosition(pos: Marker) {
      this.drawnMarker!.setLatLng(pos.getLatLng())
      this.leafletMap.removeLayer(pos)
    }

    changeMarkerPosition(newPoint: GeoPoint) {
      if (this.drawnMarker) {
        this.drawnMarker.setLatLng(new LatLng(newPoint.lat, newPoint.lon))
      }
    }

    updateRectangle(area: MapArea, layer: Rectangle) {
      layer.setBounds([[area.bottom, area.left], [area.top, area.right]])
    }

    updateDrawnRectangle(area: MapArea) {
      if (this.drawnRectangle) {
        this.updateRectangle(area, this.drawnRectangle);
      }
    }

    updateShowRectangle(area: MapArea) {
      if (this.showRectangle) {
        this.updateRectangle(area, this.showRectangle);
      } else {
        this.showRectangle = this.areaToRectangle(area, {interactive: false, fillOpacity: 0, color: 'green'})
        this.showRectangle.addTo(this.leafletMap)
      }
    }

    rectangleToArea(rect: Rectangle): MapArea {
      const bounds = rect.getBounds()
      const nw = bounds.getNorthWest();
      const se = bounds.getSouthEast();
      return {
        top: nw.lat,
        bottom: se.lat,
        left: nw.lng,
        right: se.lng,
      }
    }

    areaToRectangle(area: MapArea, options: {}): Rectangle {
      const corner1 = latLng(area.bottom, area.left);
      const corner2 = latLng(area.top, area.right);
      const bounds = latLngBounds(corner1, corner2);
      return rectangle(bounds, options);
    }


    removeShowRectangle() {
      this.leafletMap.removeLayer(this.showRectangle);
    }

    emitEventSubject(event: MapEvent) {
        this.mapEventSubject.next(event);
    }

    markerToPoint(marker: Marker): GeoPoint {
      const latlng = marker.getLatLng()
      return {
        lon: latlng.lng,
        lat: latlng.lat
      }
    }

}
