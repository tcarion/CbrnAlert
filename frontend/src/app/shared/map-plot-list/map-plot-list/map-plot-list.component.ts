import { MapPlotState } from './../../../core/state/map-plot.state';
import { Observable, Subject, combineLatest, map } from 'rxjs';
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { MapPlot } from 'src/app/core/models/map-plot';
import { Select, Store } from '@ngxs/store';
import { MapPlotAction } from 'src/app/core/state/map-plot.state';
import { MapPlotsService } from 'src/app/core/services/map-plots.service';
import { throwToolbarMixedModesError } from '@angular/material/toolbar';



@Component({
    selector: 'app-map-plot-list',
    templateUrl: './map-plot-list.component.html',
    styleUrls: ['./map-plot-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
  })

export class MapPlotListComponent {
    @Select(MapPlotState.filterType('atp45')) atp45Plots$: Observable<MapPlot[]>
    @Select(MapPlotState.filterType('flexpart')) flexpartPlots$: Observable<MapPlot[]>
    @Select(MapPlotState.filterType('stats')) statsPlots$: Observable<MapPlot[]>
    
    visibleStatsPlots$: Observable<MapPlot[]>
    flexpartCombined$: Observable<MapPlot[]>

    constructor(
        private store: Store,
        private mapPlotsService : MapPlotsService
    ) { }

    ngOnInit(): void {
        this.visibleStatsPlots$ = this.statsPlots$.pipe(
            map(plots => plots.filter(plot => plot.visible))
        );
        this.flexpartCombined$ = combineLatest([ this.flexpartPlots$, this.visibleStatsPlots$ ]).pipe(
            map(([flexpart, stats]) => [...flexpart, ...stats])
        );
    }

    toggleVisibility(plot: MapPlot) {
        plot.visible ? this.store.dispatch(new MapPlotAction.Hide(plot.id)) : this.store.dispatch(new MapPlotAction.Show(plot.id));
    }

    setActive(plotId: number) {
        this.store.dispatch(new MapPlotAction.SetActive(plotId));
    }

    onPlotClick(plot: MapPlot) {
        this.store.dispatch(new MapPlotAction.SetActive(plot.id));
    }

    delete(plotId: number) {
        this.store.dispatch(new MapPlotAction.Remove(plotId));
    }
}