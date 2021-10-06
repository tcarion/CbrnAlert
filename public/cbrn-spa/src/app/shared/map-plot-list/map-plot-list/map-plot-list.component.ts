import { MapPlotState } from './../../../core/state/map-plot.state';
import { Observable, Subject } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MapPlot } from 'src/app/core/models/map-plot';
import { MapPlotsService } from 'src/app/core/services/map-plots.service';
import { map, takeUntil } from 'rxjs/operators';
import { Select, Store } from '@ngxs/store';
import { MapPlotAction } from 'src/app/core/state/actions/map-plot.actions';


@Component({
    selector: 'app-map-plot-list',
    templateUrl: './map-plot-list.component.html',
    styleUrls: ['./map-plot-list.component.scss']
})

export class MapPlotListComponent implements OnInit, OnDestroy {
    // private readonly onDestroy = new Subject<void>();

    @Select(MapPlotState.filterType('atp45')) atp45Plots$: Observable<MapPlot[]>
    @Select(MapPlotState.filterType('flexpart')) flexpartPlots$: Observable<MapPlot[]>
    // flexpartPlots$: Observable<MapPlot[]> = this.mapPlotsService.mapPlots$.pipe(map((plots) => plots.filter((plot) => plot.type === 'flexpart')));

    // flexpartPlots: MapPlot[] = [];

    constructor(
        private store: Store,
    ) { }

    ngOnInit(): void {
        // this.sortPlots(this.mapPlotsService.plots);

        // this.mapPlotsService.newAtp45Plot()
        //     .pipe(takeUntil(this.onDestroy))
        //     .subscribe();
    }

    // sortPlots(plots: MapPlot[]) {
    //     this.atp45Plots = plots.filter((plot: any) => plot.type === 'atp45');
    //     this.flexpartPlots = plots.filter((plot: any) => plot.type === 'flexpart');
    // }

    toggleVisibility(plot: MapPlot) {
        plot.visible ? this.store.dispatch(new MapPlotAction.Hide(plot.id)) : this.store.dispatch(new MapPlotAction.Show(plot.id));
        
    }

    setActive(plotId: number) {
        this.store.dispatch(new MapPlotAction.SetActive(plotId));
    }

    delete(plotId: number) {
        // this.mapPlotsService.deleteMapPlot(plot);
        this.store.dispatch(new MapPlotAction.Remove(plotId));
        // this.sortPlots(this.mapPlotsService.plots);
    }

    ngOnDestroy() {
        // this.onDestroy.next();
        // this.onDestroy.complete();
    }
}
