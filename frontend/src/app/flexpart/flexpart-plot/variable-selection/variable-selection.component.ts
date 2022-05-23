import { FlexpartService } from 'src/app/flexpart/flexpart.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FlexpartOutput } from 'src/app/core/api/models';
import { tap } from 'rxjs/operators';

@Component({
    selector: 'app-variable-selection',
    templateUrl: './variable-selection.component.html',
    styleUrls: ['./variable-selection.component.scss']
})
export class VariableSelectionComponent implements OnInit {

    // @Select(FlexpartState.fpOutput)
    // fpOutput$: Observable<FlexpartOutput>;
    
    // fpOutputVar2D$: Observable<string[]>;

    // selectedVarSub = new Subject<string>();
    // selectedVar$: Observable<string>;
    fpOutput: FlexpartOutput
    spatialLayers: string[];

    constructor(
        private flexpartService: FlexpartService,
        private route: ActivatedRoute,
    ) {
        // this.selectedVar$ = this.selectedVarSub.asObservable();
    }
    
    ngOnInit(): void {
        const params = this.route.snapshot.paramMap;
        const runId = params.get('runId');
        const outputId = params.get('outputId');

        this.flexpartService.getOutput(runId as string, outputId as string)
        .pipe(
            tap(res => {
                this.flexpartService.getSpatialLayers(res.uuid).subscribe(layers => {
                    this.spatialLayers = layers;
                });
            })
        )
        .subscribe(fpOutput => {
            this.fpOutput = fpOutput
        })
        // this.route.data.subscribe(data => {
        //     this.store.dispatch(new FlexpartOutputAction.Add(data.fpOutput));
        // })

        // this.fpOutputVar2D$ = this.fpOutput$.pipe(map(out => out.variables2d))
    }

    goToVariable(i: number) {
        // this.selectedVarSub.next((this.store.selectSnapshot(state => state.flexpart.fpOutput.variables2d[i])));
    }

}
