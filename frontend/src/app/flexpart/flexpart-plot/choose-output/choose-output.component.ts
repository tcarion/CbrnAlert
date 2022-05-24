import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FlexpartService } from 'src/app/flexpart/flexpart.service';
import { FlexpartOutput } from 'src/app/core/api/models';
import { SelectionDialogComponent } from 'src/app/flexpart/selection-dialog/selection-dialog.component';
import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-choose-output',
    templateUrl: './choose-output.component.html',
    styleUrls: ['./choose-output.component.scss']
})
export class ChooseOutputComponent implements OnInit {

    fpOutputs$: Observable<FlexpartOutput[]>;

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
        this.fpOutputs$ = this.route.paramMap.pipe(
            switchMap(params => {
                let runId = params.get('runId') as string;
                return this.flexpartService.getOutputs(runId);
            })
        )
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
