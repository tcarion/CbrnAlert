import { FlexpartService } from 'src/app/flexpart/flexpart.service';
import { Component, OnInit } from '@angular/core';
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

    // @Select(FlexpartState.fpOutput)
    // fpOutput$: Observable<FlexpartOutput>;

    // fpOutputVar2D$: Observable<string[]>;

    // selectedVarSub = new Subject<string>();
    // selectedVar$: Observable<string>;
    // fpOutput$: Observable<FlexpartOutput>
    spatialLayers$: Observable<string[]>;

    constructor(
        private flexpartService: FlexpartService,
        private route: ActivatedRoute,
    ) {
        // this.selectedVar$ = this.selectedVarSub.asObservable();
    }

    ngOnInit(): void {
        this.spatialLayers$ = this.route.paramMap.pipe(
            switchMap(params => {
                const runId = params.get('runId');
                const outputId = params.get('outputId');
                return this.flexpartService.getOutput(runId as string, outputId as string)
                    .pipe(
                        switchMap(res => {
                            return this.flexpartService.getSpatialLayers(res.uuid)
                        })
                    )
            })
        )
        // const params = this.route.snapshot.paramMap;
        // const runId = params.get('runId');
        // const outputId = params.get('outputId');

        // this.flexpartService.getOutput(runId as string, outputId as string)
        //     .pipe(
        //         tap(res => {
        //             this.flexpartService.getSpatialLayers(res.uuid).subscribe(layers => {
        //                 this.spatialLayers = layers;
        //             });
        //         })
        //     )
        //     .subscribe(fpOutput => {
        //         this.fpOutput = fpOutput
        //     })
        // this.route.data.subscribe(data => {
        //     this.store.dispatch(new FlexpartOutputAction.Add(data.fpOutput));
        // })

        // this.fpOutputVar2D$ = this.fpOutput$.pipe(map(out => out.variables2d))
    }

    goToVariable(i: number) {
        // this.selectedVarSub.next((this.store.selectSnapshot(state => state.flexpart.fpOutput.variables2d[i])));
    }

}
