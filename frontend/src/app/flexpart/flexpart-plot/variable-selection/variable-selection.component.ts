import { FlexpartService } from 'src/app/flexpart/flexpart.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FlexpartOutput } from 'src/app/core/api/models';
import { map, switchMap, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-variable-selection',
    templateUrl: './variable-selection.component.html',
    styleUrls: ['./variable-selection.component.scss']
})
export class VariableSelectionComponent implements OnInit {

    value: string
    spatialLayers$: Observable<string[]>;
    spatialLayersList: string[] = [];
    selectedCategory: string | null = null;
    selectedLayer: string | null = null;
    categories = [
        { id: 'mr', name: 'Air Concentration' },
        { id: 'WD', name: 'Wet Deposition' },
        { id: 'DD', name: 'Dry Deposition' },
        { id: 'TD', name: 'Total Deposition' },
        { id: 'ORO', name: 'Surface Elevation' }
    ];

    @Output() selectedIdEvent = new EventEmitter<string>();

    @Input()
    get outputId() {return this._outputId}
    set outputId(v:string) {
      this.spatialLayers$ = this.flexpartService.getOutput(v).pipe(
        switchMap(res => {
            return this.flexpartService.getSpatialLayers(res.uuid)
        })
      )
      this._outputId = v
    }

    _outputId = ''

    constructor(
        private flexpartService: FlexpartService,
        private route: ActivatedRoute,
    ) {
    }

    ngOnInit(): void {
        this.spatialLayers$.subscribe(layers => {
            this.spatialLayersList = layers;
        });
    }

    onClick(e: string) {
    console.log(`clicked ${e}`);
      this.selectedIdEvent.emit(e);
      this.value = e;
    }

    onCategoryChange() {
        this.selectedLayer = null;
    }

    getLayersForCategory(categoryId: string): string[] {
        return this.spatialLayersList.filter(layer => layer.includes(categoryId));
    }
}
