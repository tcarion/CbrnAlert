import { FlexpartOutput } from '../../flexpart-output';
import { ActivatedRoute, Router } from '@angular/router';
import { FlexpartResult } from 'src/app/flexpart/flexpart-result';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SelectionDialogComponent } from 'src/app/shared/selection-dialog/selection-dialog.component';

@Component({
    selector: 'app-choose-output',
    templateUrl: './choose-output.component.html',
    styleUrls: ['./choose-output.component.scss']
})
export class ChooseOutputComponent implements OnInit {

    fpResult: FlexpartResult;

    constructor(
        public dialog: MatDialog,
        private router: Router,
        private route: ActivatedRoute,
    ) { 
        // this.fpResult = this.router.getCurrentNavigation()?.extras.state?.fpResult;
        // if (this.fpResult.outputs.length == 1) {
        //     this.goToOutput(this.fpResult.outputs[0])
        // } else {
        //     this.openDialog(this.fpResult);
        // }
    }

    ngOnInit(): void {
        // debugger
        this.route.data.subscribe(data => {
            const fpResult = data.fpResult;
            if (fpResult.outputs.length == 1) {
                this.goToOutput(fpResult.outputs[0])
            } else {
                this.openDialog(fpResult);
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

    openDialog(fpResult: FlexpartResult) {
        const dialogRef = this.dialog.open(SelectionDialogComponent, {
            data: {
                title: 'Select a NetCDF file :',
                items: fpResult.outputs.map(output => { return { dataKey: output.id, value: output } })
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            this.goToOutput(result);
        })
    }

}
