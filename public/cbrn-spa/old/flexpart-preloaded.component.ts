import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { FlexpartPlotComponent } from './flexpart-plot/flexpart-plot.component';
import { FlexpartRunPreloadedComponent } from './flexpart-run-preloaded/flexpart-run-preloaded.component';

@Component({
    selector: 'app-flexpart-preloaded',
    templateUrl: './flexpart-preloaded.component.html',
    styleUrls: ['./flexpart-preloaded.component.scss']
})
export class FlexpartPreloadedComponent implements OnInit, AfterViewInit {

    @ViewChild('tabGroup') tabGroup: MatTabGroup;
    @ViewChild(FlexpartRunPreloadedComponent) runComp: FlexpartRunPreloadedComponent;
    @ViewChild(FlexpartPlotComponent) plotComp: FlexpartPlotComponent;

    constructor() { }

    ngOnInit(): void {
    }

    ngAfterViewInit() {
        // this.tabGroup.selectedIndexChange.subscribe(
        //     (index) => {
        //         let formComp = 
        //             index == 0 ? this.runComp.runFormComp : 
        //             index == 1 ? this.plotComp.plotFormComp : this.runComp.runFormComp;
                
        //         formComp.formService.newCurrentForm(formComp.formGroup, formComp.form)
        //     }
        // )
    }

}
