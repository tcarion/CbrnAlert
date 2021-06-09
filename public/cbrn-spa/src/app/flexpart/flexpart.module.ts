import { MatTabsModule } from '@angular/material/tabs';
import { FlexpartPlotFormComponent } from './flexpart-preloaded/flexpart-plot/flexpart-plot-form/flexpart-plot-form.component';
import { FlexpartPlotComponent } from './flexpart-preloaded/flexpart-plot/flexpart-plot.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetDataComponent } from './met-data/met-data.component';
import { FlexpartRunPreloadedComponent } from './flexpart-preloaded/flexpart-run-preloaded/flexpart-run-preloaded.component';
import { FlexpartPreloadedComponent } from './flexpart-preloaded/flexpart-preloaded.component';
import { FlexpartRunPreloadedFormComponent } from './flexpart-preloaded/flexpart-run-preloaded/flexpart-run-preloaded-form/flexpart-run-preloaded-form.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
    declarations: [
        MetDataComponent,
        FlexpartPreloadedComponent,
        FlexpartRunPreloadedComponent,
        FlexpartRunPreloadedFormComponent,
        FlexpartPlotComponent,
        FlexpartPlotFormComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        MatTabsModule
    ],
    exports: [
        MetDataComponent,
        FlexpartPreloadedComponent,
    ]
})
export class FlexpartModule { }
