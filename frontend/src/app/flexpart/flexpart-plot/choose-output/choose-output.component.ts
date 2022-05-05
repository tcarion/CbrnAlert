import { FlexpartOutput } from '../../flexpart-output';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { FlexpartResult } from 'src/app/flexpart/flexpart-result';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SelectionDialogComponent } from 'src/app/shared/selection-dialog/selection-dialog.component';
import { FlexpartService } from 'src/app/flexpart/flexpart.service';

@Component({
    selector: 'app-choose-output',
    templateUrl: './choose-output.component.html',
    styleUrls: ['./choose-output.component.scss']
})
export class ChooseOutputComponent implements OnInit {

    fpOutput: FlexpartOutput;

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
        // this.flexpartService.getOutputs(this.route.snapshot.params['fpResultId']).subscribe( outputs => {
        //     if (outputs.length == 1) {
        //         this.goToOutput(outputs[0])
        //     } else {
        //         this.openDialog(outputs);
        //     }
        // });
        // this.route.data.subscribe(data => {
        //     const fpResult = data.fpResult;
        //     if (fpResult.outputs.length == 1) {
        //         this.goToOutput(fpResult.outputs[0])
        //     } else {
        //         this.openDialog(fpResult);
        //     }
        // })
        this.route.data.subscribe(data => {
            const outputs = data.fpOutputs;
            if (outputs.length == 1) {
                this.goToOutput(outputs[0])
            } else {
                this.openDialog(outputs);
            }
        })
    }

    goToOutput(fpOutput: FlexpartOutput) {
        this.router.navigate([fpOutput.id], { 
            relativeTo: this.route,
            state: {
                fpOutput
            }
        })
    }

    // openDialog(fpResult: FlexpartResult) {
    //     const dialogRef = this.dialog.open(SelectionDialogComponent, {
    //         data: {
    //             title: 'Select a NetCDF file :',
    //             items: fpResult.outputs.map(output => { return { dataKey: output.id, value: output } })
    //         }
    //     });

    //     dialogRef.afterClosed().subscribe(result => {
    //         this.goToOutput(result);
    //     })
    // }
    openDialog(fpOutputs: FlexpartOutput[]) {
        const dialogRef = this.dialog.open(SelectionDialogComponent, {
            data: {
                title: 'Select a NetCDF file :',
                items: fpOutputs.map(output => { return { dataKey: output.id, value: output } })
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            this.goToOutput(result);
        })
    }
}
