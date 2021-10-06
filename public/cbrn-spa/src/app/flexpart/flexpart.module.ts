import { MatTabsModule } from '@angular/material/tabs';
import { FlexpartPlotFormComponent } from './flexpart-plot/flexpart-plot-form/flexpart-plot-form.component';
import { FlexpartPlotComponent } from './flexpart-plot/flexpart-plot.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetDataComponent } from './met-data/met-data.component';
import { FlexpartRunPreloadedComponent } from './flexpart-run-preloaded/flexpart-run-preloaded.component';
import { FlexpartRunPreloadedFormComponent } from './flexpart-run-preloaded/flexpart-run-preloaded-form/flexpart-run-preloaded-form.component';
import { SharedModule } from '../shared/shared.module';
import { FlexpartService } from './flexpart.service';
import { FlexpartRoutingModule } from './flexpart-routing.module';
import { ChooseOutputComponent } from './flexpart-plot/choose-output/choose-output.component';
import { ResultResolverService } from './result-resolver.service';
import { OutputFormComponent } from './flexpart-plot/output-form/output-form.component';
import { VariableSelectionComponent } from './flexpart-plot/variable-selection/variable-selection.component';



@NgModule({
    declarations: [
        MetDataComponent,
        FlexpartRunPreloadedComponent,
        FlexpartRunPreloadedFormComponent,
        FlexpartPlotComponent,
        FlexpartPlotFormComponent,
        ChooseOutputComponent,
        OutputFormComponent,
        VariableSelectionComponent
    ],
    providers: [
        FlexpartService,
        ResultResolverService,
    ],
    imports: [
        FlexpartRoutingModule,
        CommonModule,
        SharedModule,
        MatTabsModule
    ],
    exports: [
        MetDataComponent,
        FlexpartRunPreloadedComponent,
        FlexpartPlotComponent,
    ]
})
export class FlexpartModule { }
