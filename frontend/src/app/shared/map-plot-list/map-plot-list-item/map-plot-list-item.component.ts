import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MapPlot } from 'src/app/core/models/map-plot';

@Component({
    selector: 'app-map-plot-list-item',
    templateUrl: './map-plot-list-item.component.html',
    styleUrls: ['./map-plot-list-item.component.scss']
})
export class MapPlotListItemComponent implements OnInit {

    @Input() plots: MapPlot[] | null;
    @Input() title: string;
    
    @Output() visibilityEvent = new EventEmitter<MapPlot>();
    @Output() deleteEvent = new EventEmitter<number>();
    @Output() itemClickEvent = new EventEmitter<number>();
    constructor() { }

    ngOnInit(): void {
    }

    onToggleVisibility(plot: MapPlot) {
        this.visibilityEvent.emit(plot);
        console.log("you changed visibility!")
    }

    onItemClick(plotId: number) {
        this.itemClickEvent.emit(plotId);
        const selectedPlot = this.getPlotById(plotId);
        if (selectedPlot) {
            console.log("You selected Plot N° " + (plotId + 1));
            console.log("Selected Layer for this Plot: " + selectedPlot.selectedLayer);
          } else {
            console.log("Plot with ID " + plotId + " not found.");
          }
    }

    onDelete(plotId: number) {
        this.deleteEvent.emit(plotId);
    }

    getPlotById(plotId: number): MapPlot | undefined {
        if (this.plots) {
            return this.plots.find(plot => plot.id === plotId);
        }
        return undefined;
    }

}
