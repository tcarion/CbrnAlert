import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FlexpartService } from 'src/app/flexpart/flexpart.service';
import { FlexpartOutput } from 'src/app/core/api/models';
import { SelectionDialogComponent } from 'src/app/flexpart/selection-dialog/selection-dialog.component';

@Component({
    selector: 'app-choose-output',
    templateUrl: './choose-output.component.html',
    styleUrls: ['./choose-output.component.scss']
})
export class ChooseOutputComponent implements OnInit {

    fpOutput: FlexpartOutput;
    fpOutputs: FlexpartOutput[];

    constructor(
        private flexpartService: FlexpartService,
        public dialog: MatDialog,
        private router: Router,
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
        let runId = this.route.snapshot.paramMap.get('runId') as string;
        this.flexpartService.getOutputs(runId).subscribe(fpOutputs => {
            // if (fpOutputs.length == 1) {
            //     this.goToOutput(fpOutputs[0])
            // } else {
            //     this.openDialog(fpOutputs);
            // }
            this.fpOutputs = fpOutputs;
        })
        // this.route.data.subscribe(data => {
        //     const outputs = data.fpOutputs;
        //     if (outputs.length == 1) {
        //         this.goToOutput(outputs[0])
        //     } else {
        //         this.openDialog(outputs);
        //     }
        // })
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
