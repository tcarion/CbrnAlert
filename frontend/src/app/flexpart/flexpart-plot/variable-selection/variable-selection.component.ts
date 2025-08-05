import { FlexpartService } from 'src/app/flexpart/flexpart.service';
import { Component, EventEmitter, Input, OnInit, Output, ChangeDetectorRef } from '@angular/core';
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
    releasedSpecies: string[] = [];
    selectedCategory: string | null = null;
    displayLayerOptions: { label: string, value: string }[] = [];
    selectedLayer: string | null = null;
    isLoading = true;
    categories = [
        { id: 'mr', name: 'Air Concentration' },
        { id: 'WD', name: 'Wet Deposition' },
        { id: 'DD', name: 'Dry Deposition' },
        { id: 'TD', name: 'Total Deposition' },
        { id: 'ORO', name: 'Surface Elevation' }
    ];
    availableCategories: { id: string, name: string }[] = [];


    @Output() selectedIdEvent = new EventEmitter<{ value: string, label: string }>();

    @Input()
    get outputId() {return this._outputId}
    set outputId(v: string) {
        this._outputId = v;
        this.isLoading = true;

        // Reset internal state when outputId changes
        this.selectedCategory = null;
        this.selectedLayer = null;
        this.spatialLayersList = [];
        this.releasedSpecies = [];
      
        this.flexpartService.getOutput(v).pipe(
          tap(res => {
            this.releasedSpecies = JSON.parse(res.metadata as string)["specs_rel"];
          }),
          switchMap(res => this.flexpartService.getSpatialLayers(res.uuid))
        ).subscribe(layers => {
          this.spatialLayersList = layers;
          this.updateAvailableCategories();
          this.isLoading = false;
          this.changeDetectorRef.detectChanges();
        });
    }

    _outputId = ''

    constructor(
        private flexpartService: FlexpartService,
        private route: ActivatedRoute,
        private changeDetectorRef: ChangeDetectorRef
    ) {
    }

    ngOnInit(): void {
    }

    onClick(value: string, label: string) {
        this.selectedIdEvent.emit({ value, label });
        this.value = value;
    }

    onCategoryChange() {
        this.selectedLayer = null;
        if (this.selectedCategory === 'ORO') {
            const oroLayer = this.spatialLayersList.filter(layer => layer.includes('ORO'))[0];
            if (oroLayer) {
              this.selectedLayer = oroLayer;
              this.value = oroLayer;
              this.selectedIdEvent.emit({ value: oroLayer, label: ''});
            }
            this.displayLayerOptions = [];
        }
         else {
            this.displayLayerOptions = this.getDisplayLayersForCategory(this.selectedCategory!);
            this.selectedIdEvent.emit(undefined);
        }
    }

    private updateAvailableCategories() {
        this.availableCategories = this.categories.filter(category =>
          this.spatialLayersList.some(layer => layer.includes(category.id))
        );
    }

    getDisplayLayersForCategory(categoryId: string): { label: string, value: string }[] {
        const matchingLayers = this.spatialLayersList.filter(layer => layer.includes(categoryId));
        const options: { label: string, value: string }[] = [];
        const specIdToSpecies: Record<string, string> = {};
        const specCount: Record<string, number> = {};
        const specSeenSoFar: Record<string, number> = {};

        for (let i = 0; i < this.releasedSpecies.length; i++) {
            const specId = `spec${String(i + 1).padStart(3, '0')}`; // spec001, spec002, ...
            const specName = this.releasedSpecies[i];
            specIdToSpecies[specId] = specName;
            specCount[specName] = (specCount[specName] || 0) + 1;
        }

        for (const layer of matchingLayers) {
            const match = layer.match(/(spec\d+)/);
            const specId = match ? match[1] : null;
            let baseName = 'Unknown Substance';
            if (specId && specIdToSpecies[specId]) {
                baseName = specIdToSpecies[specId];
            }
            specSeenSoFar[baseName] = (specSeenSoFar[baseName] || 0) + 1;
            const releaseNumber = specSeenSoFar[baseName];
            const isMultipleReleases = specCount[baseName] > 1;
            const label = isMultipleReleases ? `${baseName} (release ${releaseNumber})` : baseName;
            options.push({ label, value: layer });
        }

        return options;
    }

}
