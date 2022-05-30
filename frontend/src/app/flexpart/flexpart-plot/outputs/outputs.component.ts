import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FlexpartService } from 'src/app/flexpart/flexpart.service';
import { FlexpartOutput } from 'src/app/core/api/models';
import { Observable, of } from 'rxjs';

@Component({
    selector: 'app-choose-output',
    templateUrl: './outputs.component.html',
    styleUrls: ['./outputs.component.scss']
})
export class OutputsComponent implements OnInit {

    fpOutputs$: Observable<FlexpartOutput[]>;
    @Output() selectedIdEvent = new EventEmitter<string>();

    @Input()
    get runId() {return this._runId}
    set runId(v:string) {
      this.fpOutputs$ = this.flexpartService.getOutputs(v)
      this._runId = v
    }

    _runId = ''

    value: string
    constructor(
        private flexpartService: FlexpartService,
        private route: ActivatedRoute,
    ) {
        // this.fpOutput = this.route.data.
        // this.fpResult = this.router.getCurrentNavigation()?.extras.state?.fpResult;
        // if (this.fpResult.outputs.length == 1) {
        //     this.goToOutput(this.fpResult.outputs[0])
        // } else {
        //     this.openDialog(this.fpResult);
        // }
    }

    ngOnInit(): void {
        // this.fpOutputs$ = this.route.paramMap.pipe(
        //     switchMap(params => {
        //         let runId = params.get('runId') as string;
        //         return this.flexpartService.getOutputs(runId);
        //     })
        // )
        // this.fpOutputs$ = this.flexpartService.getOutputs(this.runId)
        // this.fpOutputs$ = this.route.data.pipe(map(data => data.fpOuputs))
    }

    onClick(v: string) {
      this.selectedIdEvent.emit(v);
      this.value = v;
    }
    // goToOutput(fpOutput: FlexpartOutput) {
    //     this.router.navigate([fpOutput.uuid], {
    //         relativeTo: this.route,
    //         state: {
    //             fpOutput
    //         }
    //     })
    // }

    // openDialog(fpOutputs: FlexpartOutput[]) {
    //     const dialogRef = this.dialog.open(SelectionDialogComponent, {
    //         data: {
    //             title: 'Select a NetCDF file :',
    //             items: fpOutputs.map(output => { return { dataKey: output.uuid, value: output } })
    //         }
    //     });

    //     dialogRef.afterClosed().subscribe(result => {
    //         this.goToOutput(result);
    //     })
    // }
}
