import { Select, Store } from '@ngxs/store';
import { Component, OnInit, ChangeDetectionStrategy, Input, OnDestroy } from '@angular/core';
import { Feature, FeatureCollection } from 'geojson';
import { FeatureGroup, Layer, LayerGroup, TileLayer } from 'leaflet';
import { ColorbarData } from 'src/app/core/api/models';
import { MapPlot } from 'src/app/core/models/map-plot';
import { MapPlotsService } from 'src/app/core/services/map-plots.service';
import { MapPlotState, MapPlotAction } from 'src/app/core/state/map-plot.state';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-plot-layer',
  template: `
			<div *ngIf="layer && visible" [leafletLayer]="layer"></div>
		`,
  styles: [`

		`],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlotLayerComponent implements OnInit, OnDestroy {
  @Input() mapPlot: MapPlot;
  @Input() visible = true;
  // @Input()
  // get isActive(): boolean { return this._isActive}
  // set isActive(v:boolean) {
  //   if (this.layer !== undefined) {
  //     if (v === true) {
  //       (this.layer as FeatureGroup).setStyle({ fillOpacity: 0.8 })
  //     } else {
  //       (this.layer as FeatureGroup).setStyle({ fillOpacity: 0.4 })
  //     }
  //   }
  //   this._isActive = v
  // }

  @Select(MapPlotState.activePlot) activePlot$: Observable<MapPlot>;;

  layer: FeatureGroup | TileLayer;
  sub: Subscription;

  constructor(
    public mapPlotsService: MapPlotsService,
    public store: Store
    ) {}

  ngOnInit(): void {
    if (this.mapPlot.type == 'flexpart') {
      if (this.mapPlot.geojson !== undefined) {
        this.layer = this.mapPlotsService.flexpartPlotToLayer(this.mapPlot.geojson as FeatureCollection);
        this.mapPlotsService.setColors(this.layer as LayerGroup, this.mapPlot.metadata as ColorbarData);

        this.sub = this.activePlot$.subscribe(plot => {
          if (plot !== undefined) {
            const layer = this.layer as FeatureGroup
            if (this.mapPlot.id == plot.id) {
              layer.setStyle({ opacity: 0.6 })
            } else {
              layer.setStyle({ opacity: 0.2 })
            }
          }
        });
      } else {
        this.layer = this.mapPlotsService.addTiff(this.mapPlot.data) as unknown as TileLayer;

        this.sub = this.activePlot$.subscribe(plot => {
          if (plot !== undefined) {
            const layer = this.layer as TileLayer
            if (this.mapPlot.id == plot.id) {
              layer.setOpacity(0.6)
            } else {
              layer.setOpacity(0.2)
            }
          }
        });
      }

      this.layer.on('click', layer => {
        this.store.dispatch(new MapPlotAction.SetActive(this.mapPlot.id))
      })
    } else if (this.mapPlot.type == 'atp45') {
      let featureGroup = this.mapPlotsService.atp45PlotToLayer(this.mapPlot.geojson as FeatureCollection);
      featureGroup.eachLayer((layers: any) => {
        layers.eachLayer((layer: any) => {
          layer.bindPopup(layer.feature.properties.type)
          console.log(layer)
        })
      })
      this.layer = featureGroup;
    }
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
