import { Observable, Subject } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MapPlot } from 'src/app/core/models/map-plot';
import { MapPlotsService } from 'src/app/core/services/map-plots.service';
import { map, takeUntil } from 'rxjs/operators';


@Component({
    selector: 'app-map-plot-list',
    templateUrl: './map-plot-list.component.html',
    styleUrls: ['./map-plot-list.component.scss']
})

export class MapPlotListComponent implements OnInit, OnDestroy {
    private readonly onDestroy = new Subject<void>();

    atp45Plots$: Observable<MapPlot[]> = this.mapPlotsService.mapPlots$.pipe(map((plots) => plots.filter((plot) => plot.type === 'atp45')));
    flexpartPlots$: Observable<MapPlot[]> = this.mapPlotsService.mapPlots$.pipe(map((plots) => plots.filter((plot) => plot.type === 'flexpart')));

    // flexpartPlots: MapPlot[] = [];

    constructor(
        private mapPlotsService: MapPlotsService,
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
        plot.visible ? this.mapPlotsService.hideMapPlot(plot) : this.mapPlotsService.showMapPlot(plot);
        
    }

    delete(plot: MapPlot) {
        this.mapPlotsService.deleteMapPlot(plot);
        // this.sortPlots(this.mapPlotsService.plots);
    }

    ngOnDestroy() {
        this.onDestroy.next();
        this.onDestroy.complete();
    }
}
